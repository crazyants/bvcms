/* Author: David Carroll
 * Copyright (c) 2008, 2009 Bellevue Baptist Church 
 * Licensed under the GNU General Public License (GPL v2)
 * you may not use this code except in compliance with the License.
 * You may obtain a copy of the License at http://bvcms.codeplex.com/license 
 */
using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using UtilityExtensions;
using System.Web.Caching;
using System.Data.SqlClient;

namespace CmsData
{
    public static partial class DbUtil
    {
        public static bool DatabaseExists(string name)
        {
            using (var cn = new SqlConnection(Util.GetConnectionString2("master", 3)))
            {
                cn.Open();
                return DatabaseExists(cn, name);
            }
        }
        private static bool DatabaseExists(SqlConnection cn, string name)
        {
            var cmd = new SqlCommand(
                    "SELECT CAST(CASE WHEN EXISTS(SELECT NULL FROM sys.databases WHERE name = '"
                    + name + "') THEN 1 ELSE 0 END AS BIT)", cn);
            return (bool)cmd.ExecuteScalar();
        }
        public enum CheckDatabaseResult
        {
            DatabaseExists,
            DatabaseDoesNotExist,
            ServerNotFound
        }
        public static bool CmsDatabaseExists()
        {
            var exists = (bool?)HttpRuntime.Cache[Util.Host + "-DatabaseExists"];
            if (exists.HasValue)
                return exists.Value;

            var r = CheckDatabaseExists(Util.CmsHost);
            var b = CheckDatabaseResult.DatabaseExists == r;
            HttpRuntime.Cache.Insert(Util.Host + "-DatabaseExists", b, null,
                DateTime.Now.AddSeconds(60), Cache.NoSlidingExpiration);
            return b;
        }

        public static CheckDatabaseResult CheckDatabaseExists(string name, bool nocache = false)
        {
            if (nocache == false)
            {
                var r1 = HttpRuntime.Cache[Util.Host + "-CheckDatabaseResult"];
                if (r1 != null)
                    return (CheckDatabaseResult)r1;
            }

            using (var cn = new SqlConnection(Util.GetConnectionString2("master", 3)))
            {
                cn.Open();
                var b = DatabaseExists(cn, name);
                var ret = b ? CheckDatabaseResult.DatabaseExists : CheckDatabaseResult.DatabaseDoesNotExist;
                if (nocache == false)
                {
                    HttpRuntime.Cache.Insert(Util.Host + "-CheckDatabaseResult", ret, null,
                        ret == CheckDatabaseResult.ServerNotFound
                            ? DateTime.Now.AddSeconds(5)
                            : DateTime.Now.AddSeconds(60), Cache.NoSlidingExpiration);
                }
                return ret;
            }
        }
        public static string CreateDatabase()
        {
            string fn = null;
            try
            {
                var Server = HttpContext.Current.Server;
                var path = Server.MapPath("/");
                string cs = Util.GetConnectionString2("master");
                RunScripts(cs, "create database CMS_" + Util.Host);
                if (!DatabaseExists("CMSi_" + Util.Host))
                {
                    RunScripts(cs, "create database CMSi_" + Util.Host);
                    fn = "BuildImageDatabase.sql";
                    RunScripts(Util.ConnectionStringImage,
                        File.ReadAllText(path + @"..\SqlScripts\" + fn));
                }
                if (!DatabaseExists("Elmah"))
                {
                    RunScripts(cs, "create database Elmah");
                    fn = "BuildElmahDb.sql";
                    RunScripts(Util.GetConnectionString2("Elmah"),
                        File.ReadAllText(path + @"..\SqlScripts\" + fn));
                }

                using (var cn = new SqlConnection(Util.ConnectionString))
                {
                    cn.Open();
                    var list = File.ReadAllLines(path + @"..\SqlScripts\allscripts.txt");
                    foreach(var f in list)
                    {
                        fn = f;
                        var script = File.ReadAllText(path + @"..\SqlScripts\BuildDb\" + f);
                        RunScripts(cn, script);
                    }
                    fn = Util.Host == "testdb"
                        ? "datascriptTest.sql"
                        : "datascriptStarter.sql";
                    string datascript = null;
                    datascript = File.ReadAllText(path + @"..\SqlScripts\" + fn);
                    RunScripts(cn, datascript);
                }
                HttpRuntime.Cache.Remove(Util.Host + "-DatabaseExists");
                HttpRuntime.Cache.Remove(Util.Host + "-CheckDatabaseResult");

            }
            catch (Exception ex)
            {
                return string.Format("error in {0}\n{1}", fn, ex.Message);
            }
            return null;
        }

        private static void RunScripts(string cs, string script)
        {
            using (var cn = new SqlConnection(cs))
            {
                cn.Open();
                RunScripts(cn, script);
            }
        }
        private static void RunScripts(SqlConnection cn, string script)
        {
            var cmd = new SqlCommand { Connection = cn };
            var scripts = Regex.Split(script, "^GO.*$", RegexOptions.Multiline);
            foreach (var s in scripts)
                if (s.HasValue())
                {
                    cmd.CommandText = s;
                    cmd.ExecuteNonQuery();
                }
        }
    }
}
