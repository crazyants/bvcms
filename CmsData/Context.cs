﻿/* Author: David Carroll
 * Copyright (c) 2008, 2009 Bellevue Baptist Church 
 * Licensed under the GNU General Public License (GPL v2)
 * you may not use this code except in compliance with the License.
 * You may obtain a copy of the License at http://bvcms.codeplex.com/license 
 */
using System;
using System.IO;
using System.Threading;
using System.Linq;
using System.Data.Linq.SqlClient;
using UtilityExtensions;
using System.Configuration;
using System.Web;
using System.Data.Linq.Mapping;
using System.Data.Linq;
using System.Reflection;
using System.Collections.Generic;
using System.Data;

namespace CmsData
{
    public partial class CMSDataContext
    {
        const string STR_System = "System";

        partial void OnCreated()
        {
            CommandTimeout = 600;
            Host = Util.Host;
        }
        private string _LogFile;
        public string LogFile
        {
            get
            {
                if (_LogFile == null)
                    _LogFile = Setting("LinqLogFile", null);
                return _LogFile;
            }
        }
        public override void SubmitChanges(System.Data.Linq.ConflictMode failureMode)
        {
            ChangeSet cs = this.GetChangeSet();
            var typesToCheck = new Type[] { typeof(string), typeof(System.Data.Linq.Binary) };
            var insertsUpdates = (
                from i in cs.Inserts.Union(cs.Updates)
                join m in this.Mapping.GetTables() on i.GetType() equals m.RowType.Type
                select new
                {
                    Entity = i,
                    Members = m.RowType.DataMembers.Where(dm => typesToCheck.Contains(dm.Type)).ToList()
                }).Where(m => m.Members.Any()).ToList();
            foreach (var ins in insertsUpdates)
                foreach (var mm in ins.Members)
                {
                    var maxLength = GetMaxLength(mm.DbType);
                    if (mm.MemberAccessor.HasValue(ins.Entity))
                    {
                        var memberValueLength = GetMemberValueLength(mm.MemberAccessor.GetBoxedValue(ins.Entity));
                        if (maxLength > 0 && memberValueLength > maxLength)
                        {
                            var iex = new InvalidOperationException(mm.Name + " in " + mm.DeclaringType.Name + " has a value that will not fit into " + mm.DbType);
                            throw iex;
                        }
                    }
                }
            base.SubmitChanges(failureMode);
        }

        private int GetMaxLength(string dbType)
        {
            int maxLength = 0;

            if (dbType == null)
                return maxLength;
            if (dbType.Contains("("))
                dbType = dbType.Substring(dbType.IndexOf("(") + 1);
            if (dbType.Contains(")"))
                dbType = dbType.Substring(0, dbType.IndexOf(")"));
            int.TryParse(dbType, out maxLength);
            return maxLength;
        }

        private int GetMemberValueLength(object value)
        {
            if (value == null)
                return 0;
            if (value.GetType() == typeof(string))
                return ((string)value).Length;
            else if (value.GetType() == typeof(Binary))
                return ((Binary)value).Length;
            else
                throw new ArgumentException("Unknown type.");
        }
        public Person LoadPersonById(int id)
        {
            return this.People.FirstOrDefault(p => p.PeopleId == id);
        }
        public Organization LoadOrganizationById(int? id)
        {
            return this.Organizations.FirstOrDefault(o => o.OrganizationId == id);
        }
        public string FetchExtra(int pid, string field)
        {
            return this.PeopleExtras.OrderByDescending(e => e.TransactionTime)
                .First(e => e.Field == field && e.PeopleId == pid).StrValue;
        }
        public DateTime? FetchExtraDate(int pid, string field)
        {
            return this.PeopleExtras.OrderByDescending(e => e.TransactionTime)
                .First(e => e.Field == field && e.PeopleId == pid).DateValue;
        }
        private QueryBuilderClause CheckBadQuery(QueryBuilderClause qb)
        {
            if (qb != null && qb.Field == null) // bad query
            {
                DeleteQueryBuilderClauseOnSubmit(qb);
                SubmitChanges();
                return null;
            }
            return qb;
        }
        public QueryBuilderClause LoadQueryById(int? queryid)
        {
            var qb = QueryBuilderClauses.SingleOrDefault(c => c.QueryId == queryid);
            return CheckBadQuery(qb);
        }
        public IQueryable<Person> PeopleQuery(int qid)
        {
            var qB = this.LoadQueryById(qid);
            var q = People.Where(qB.Predicate(this));
            if (qB.ParentsOf)
                q = from p in q
                    from m in p.Family.People
                    where (m.PositionInFamilyId == 10 && p.PositionInFamilyId != 10)
                    || (m.PeopleId == p.PeopleId && p.PositionInFamilyId == 10)
                    select m;
            return q.Distinct();
        }
        public IQueryable<Person> PeopleQuery(string name)
        {
            var qB = this.QueryBuilderClauses.FirstOrDefault(c => c.Description == name);
            var q = People.Where(qB.Predicate(this));
            return q;
        }
        public QueryBuilderClause QueryBuilderScratchPad()
        {
            var qb = LoadQueryById(Util.QueryBuilderScratchPadId);
            if (qb == null)
            {
                qb = QueryBuilderClauses.FirstOrDefault(c => c.SavedBy == Util.UserName
                    && c.Description == Util.ScratchPad);
                qb = CheckBadQuery(qb);
                if (qb == null)
                {
                    qb = QueryBuilderClause.NewGroupClause();
                    qb.Description = Util.ScratchPad;
                    qb.SavedBy = Util.UserName;
                    QueryBuilderClauses.InsertOnSubmit(qb);
                    SubmitChanges();
                }
            }
            Util.QueryBuilderScratchPadId = qb.QueryId;
            return qb;
        }
        public QueryBuilderClause QueryBuilderHasCurrentTag()
        {
            const string STR_HasCurrentTag = "HasCurrentTag";
            var qb = QueryBuilderClauses.FirstOrDefault(c => c.SavedBy == STR_System
                && c.Description == STR_HasCurrentTag);
            if (qb == null)
            {
                qb = QueryBuilderClause.NewGroupClause();
                qb.Description = STR_HasCurrentTag;
                qb.SavedBy = STR_System;
                qb.AddNewClause(QueryType.HasCurrentTag, CompareType.Equal, "1,T");
                QueryBuilderClauses.InsertOnSubmit(qb);
                SubmitChanges();
            }
            return qb;
        }
        public QueryBuilderClause QueryBuilderInCurrentOrg()
        {
            const string STR_InCurrentOrg = "InCurrentOrg";
            var qb = QueryBuilderClauses.FirstOrDefault(c => c.SavedBy == STR_System
                && c.Description == STR_InCurrentOrg);
            if (qb == null)
            {
                qb = QueryBuilderClause.NewGroupClause();
                qb.Description = STR_InCurrentOrg;
                qb.SavedBy = STR_System;
                qb.AddNewClause(QueryType.InCurrentOrg, CompareType.Equal, "1,T");
                QueryBuilderClauses.InsertOnSubmit(qb);
                SubmitChanges();
            }
            return qb;
        }
        public QueryBuilderClause QueryBuilderInactiveCurrentOrg()
        {
            const string STR_InactiveCurrentOrg = "InactiveCurrentOrg";
            var qb = QueryBuilderClauses.FirstOrDefault(c => c.SavedBy == STR_System
                && c.Description == STR_InactiveCurrentOrg);
            if (qb == null)
            {
                qb = QueryBuilderClause.NewGroupClause();
                qb.Description = STR_InactiveCurrentOrg;
                qb.SavedBy = STR_System;
                qb.AddNewClause(QueryType.InactiveCurrentOrg, CompareType.Equal, "1,T");
                QueryBuilderClauses.InsertOnSubmit(qb);
                SubmitChanges();
            }
            return qb;
        }
        public QueryBuilderClause QueryBuilderPendingCurrentOrg()
        {
            const string STR_PendingCurrentOrg = "PendingCurrentOrg";
            var qb = QueryBuilderClauses.FirstOrDefault(c => c.SavedBy == STR_System
                && c.Description == STR_PendingCurrentOrg);
            if (qb == null)
            {
                qb = QueryBuilderClause.NewGroupClause();
                qb.Description = STR_PendingCurrentOrg;
                qb.SavedBy = STR_System;
                qb.AddNewClause(QueryType.PendingCurrentOrg, CompareType.Equal, "1,T");
                QueryBuilderClauses.InsertOnSubmit(qb);
                SubmitChanges();
            }
            return qb;
        }
        public QueryBuilderClause QueryBuilderPreviousCurrentOrg()
        {
            const string STR_PreviousCurrentOrg = "PreviousCurrentOrg";
            var qb = QueryBuilderClauses.FirstOrDefault(c => c.SavedBy == STR_System
                && c.Description == STR_PreviousCurrentOrg);
            if (qb == null)
            {
                qb = QueryBuilderClause.NewGroupClause();
                qb.Description = STR_PreviousCurrentOrg;
                qb.SavedBy = STR_System;
                qb.AddNewClause(QueryType.PreviousCurrentOrg, CompareType.Equal, "1,T");
                QueryBuilderClauses.InsertOnSubmit(qb);
                SubmitChanges();
            }
            return qb;
        }
        public QueryBuilderClause QueryBuilderVisitedCurrentOrg()
        {
            const string STR_VisitedCurrentOrg = "VisitedCurrentOrg";
            var qb = QueryBuilderClauses.FirstOrDefault(c => c.SavedBy == STR_System
                && c.Description == STR_VisitedCurrentOrg);
            if (qb == null)
            {
                qb = QueryBuilderClause.NewGroupClause();
                qb.Description = STR_VisitedCurrentOrg;
                qb.SavedBy = STR_System;
                qb.AddNewClause(QueryType.VisitedCurrentOrg, CompareType.Equal, "1,T");
                QueryBuilderClauses.InsertOnSubmit(qb);
                SubmitChanges();
            }
            return qb;
        }
        public QueryBuilderClause QueryBuilderIsCurrentPerson()
        {
            const string STR_IsCurrentPerson = "IsCurrentPerson";
            var qb = QueryBuilderClauses.FirstOrDefault(c => c.SavedBy == STR_System
                && c.Description == STR_IsCurrentPerson);
            if (qb == null)
            {
                qb = QueryBuilderClause.NewGroupClause();
                qb.Description = STR_IsCurrentPerson;
                qb.SavedBy = STR_System;
                qb.AddNewClause(QueryType.IsCurrentPerson, CompareType.Equal, "1,T");
                QueryBuilderClauses.InsertOnSubmit(qb);
                SubmitChanges();
            }
            return qb;
        }
        public void DeleteQueryBuilderClauseOnSubmit(QueryBuilderClause qb)
        {
            foreach (var c in qb.Clauses)
                DeleteQueryBuilderClauseOnSubmit(c);
            this.QueryBuilderClauses.DeleteOnSubmit(qb);
        }
        public void TagAll(IQueryable<Person> list)
        {
            var tag = TagCurrent();
            TagAll(list, tag);
        }
        public void TagAll(IQueryable<Person> list, Tag tag)
        {
            var q = from p in list
                    where !p.Tags.Any(tp => tp.Id == tag.Id)
                    select p.PeopleId;
            foreach (var id in q)
                tag.PersonTags.Add(new TagPerson { PeopleId = id });
            SubmitChanges();
        }
        public void UnTagAll(IQueryable<Person> list)
        {
            var person = list.FirstOrDefault();
            var tag = TagCurrent();
            var q = from p in list
                    from t in p.Tags
                    where t.Id == tag.Id
                    select t;

            foreach (var t in q)
                TagPeople.DeleteOnSubmit(t);
            SubmitChanges();
        }
        public Tag PopulateSpecialTag(int QueryId, int TagTypeId)
        {
            var q = PeopleQuery(QueryId);
            return PopulateSpecialTag(q, TagTypeId);
        }
        public Tag PopulateSpecialTag(IQueryable<Person> q, int TagTypeId)
        {
            var tag = FetchOrCreateTag(Util.SessionId, Util.UserPeopleId, TagTypeId);
            TagPeople.DeleteAllOnSubmit(tag.PersonTags);
            SubmitChanges();
            TagAll(q, tag);
            return tag;
        }
        public void PopulateSpecialTag(IQueryable<Person> q, string tagname)
        {
            var tag = FetchOrCreateTag(tagname, Util.UserPeopleId, DbUtil.TagTypeId_Personal);
            TagPeople.DeleteAllOnSubmit(tag.PersonTags);
            SubmitChanges();
            TagAll(q, tag);
        }
        public void DePopulateSpecialTag(IQueryable<Person> q, int TagTypeId)
        {
            var tag = FetchOrCreateTag(Util.SessionId, Util.UserPeopleId, TagTypeId);
            TagPeople.DeleteAllOnSubmit(tag.PersonTags);
            SubmitChanges();
        }
        public Tag TagById(int id)
        {
            return Tags.SingleOrDefault(t => t.Id == id);
        }
        public Tag TagCurrent()
        {
            return FetchOrCreateTag(Util2.CurrentTagName, Util2.CurrentTagOwnerId, DbUtil.TagTypeId_Personal);
        }
        //public string NewPeopleEmailAddressx
        //{
        //    get
        //    {
        //        var em = DbUtil.SystemEmailAddress;
        //        var npm = People.SingleOrDefault(p => p.PeopleId == DbUtil.NewPeopleManagerId);
        //        if (npm != null && npm.EmailAddress.HasValue())
        //            em = npm.EmailAddress;
        //        var s = Settings.Where(ss => ss.Id == "NewPeopleEmailAddress").Select(ss => ss.SettingX).SingleOrDefault();
        //        return Util.PickFirst(s, em);
        //    }
        //}
        public int NewPeopleManagerId
        {
            get
            {
                var s = Setting("NewPeopleManagerIds", "1");
                if (s.HasValue())
                    return s.SplitStr(",;")[0].ToInt();
                var q = from u in Users
                        where u.UserRoles.Any(ur => ur.Role.RoleName == "Admin")
                        select u.PeopleId.Value;
                return q.First();
            }
        }
        public IEnumerable<Person> GetNewPeopleManagers()
        {
            var s = Setting("NewPeopleManagerIds", "");
            IEnumerable<Person> q = null;
            if (s.HasValue())
            {
                var a = s.SplitStr(",").Select(ss => ss.ToInt());
                q = from p in People
                    where a.Contains(p.PeopleId)
                    select p;
                return q;
            }
            return CMSRoleProvider.provider.GetAdmins();
        }
        User _currentuser;
        public User CurrentUser
        {
            get
            {
                if (_currentuser != null)
                    return _currentuser;
                return Users.SingleOrDefault(u => u.UserId == Util.UserId);
            }
            set { _currentuser = value; }
        }
        public Person CurrentUserPerson
        {
            get
            {
                return Users.Where(u => u.UserId == Util.UserId).Select(u => u.Person).SingleOrDefault();
            }
        }
        public Tag OrgMembersOnlyTag2()
        {
            return FetchOrCreateTag(Util.SessionId, Util.UserPeopleId, DbUtil.TagTypeId_OrgMembersOnly);
        }

        public Tag FetchOrCreateTag(string tagname, int? OwnerId, int tagtypeid)
        {
            var tag = Tags.FirstOrDefault(t =>
                t.Name == tagname && t.PeopleId == OwnerId && t.TypeId == tagtypeid);
            if (tag == null)
            {
                tag = new Tag { Name = tagname, PeopleId = OwnerId, TypeId = tagtypeid };
                Tags.InsertOnSubmit(tag);
                SubmitChanges();
            }
            return tag;
        }
        public Tag FetchOrCreateSystemTag(string tagname)
        {
            var tag = Tags.FirstOrDefault(t => t.Name == tagname && t.TypeId == 100);
            if (tag == null)
            {
                tag = new Tag { Name = tagname, TypeId = 100 };
                Tags.InsertOnSubmit(tag);
                SubmitChanges();
            }
            return tag;
        }

        public void SetOrgMembersOnly()
        {
            var me = Util.UserPeopleId;
            var dt = Util.Now.AddYears(-1);

            // members of any of my orgs excluding unshared orgs
            var q = from p in People
                    where p.OrganizationMembers.Any(m =>
                        OrganizationMembers.Any(um =>
                            (um.Organization.SecurityTypeId != 3
                                || um.MemberTypeId == (int)OrganizationMember.MemberTypeCode.Teacher)
                             && um.OrganizationId == m.OrganizationId && um.PeopleId == me))
                    select p;
            var tag = PopulateSpecialTag(q, DbUtil.TagTypeId_OrgMembersOnly);
            PopulateSpecialTag(q, "OrgMemberOnlyInMyOrg");

            // prev members of any of my orgs excluding unshared orgs

            q = from p in People
                where p.EnrollmentTransactions.Any(et =>
                        et.TransactionDate > dt
                        && et.TransactionTypeId >= 4
                        && et.Organization.SecurityTypeId != 3
                        && OrganizationMembers.Any(um =>
                            um.OrganizationId == et.OrganizationId && um.PeopleId == me))
                select p;
            TagAll(q, tag);
            PopulateSpecialTag(q, "OrgMemberOnlyPrevInMyOrg");

            // members of my family
            q = from p in People
                where p.FamilyId == CurrentUser.Person.FamilyId
                select p;
            TagAll(q, tag);
            PopulateSpecialTag(q, "OrgMemberOnlyInMyFamily");

            // visitors in the last year to one of my orgs excluding unshared
            var attype = new int[] { 40, 50, 60 };
            q = from p in People
                where p.Attends.Any(a =>
                    OrganizationMembers.Any(um =>
                        um.Organization.SecurityTypeId != 3 &&
                        um.OrganizationId == a.Meeting.OrganizationId && um.PeopleId == me)
                    && attype.Contains(a.AttendanceTypeId.Value) && a.MeetingDate > dt)
                select p;
            TagAll(q, tag);
            PopulateSpecialTag(q, "OrgMemberOnlyVisitMyOrg");

            // people assigned to me in one of my tasks
            q = from p in People
                where p.TasksAboutPerson.Any(at => at.OwnerId == me || at.CoOwnerId == me)
                select p;
            TagAll(q, tag);
            PopulateSpecialTag(q, "OrgMemberOnlyInMyTask");

            // people I have visited in a contact
            q = from p in People
                where p.contactsHad.Any(c => c.contact.contactsMakers.Any(cm => cm.PeopleId == me))
                select p;
            TagAll(q, tag);
            PopulateSpecialTag(q, "OrgMemberOnlyIHaveContacted");
        }
        [Function(Name = "dbo.AddAbsents")]
        public int AddAbsents([Parameter(DbType = "Int")] int? meetid, [Parameter(DbType = "Int")] int? userid)
        {
            var result = this.ExecuteMethodCall(this, (MethodInfo)(MethodInfo.GetCurrentMethod()), meetid, userid);
            return (int)(result.ReturnValue);
        }
        [Function(Name = "dbo.UpdateAttendStr")]
        public int UpdateAttendStr([Parameter(DbType = "Int")] int? orgid, [Parameter(DbType = "Int")] int? pid)
        {
            var result = this.ExecuteMethodCall(this, ((MethodInfo)(MethodInfo.GetCurrentMethod())), orgid, pid);
            return ((int)(result.ReturnValue));
        }
        public class TopGiver
        {
            public int PeopleId;
            public string Name;
            public decimal Amount;
        }
        public class AttendMeetingInfo1
        {
            public AttendMeetingInfo2 info;
            public Attend AttendanceOrg;
            public Attend Attendance;
            public Meeting Meeting;
            public List<Attend> VIPAttendance;
            public OrganizationMember BFCMember;
            public Attend BFCAttendance;
            public Meeting BFCMeeting;
            public int path;
        }
        public class AttendMeetingInfo2
        {
            public int? AttendedElsewhere { get; set; }
            public int? MemberTypeId { get; set; }
            //public bool? IsRegularHour { get; set; }
            //public int? ScheduleId { get; set; }
            //public bool? IsSameHour { get; set; }
            public bool? IsOffSite { get; set; }
            public bool? IsRecentVisitor { get; set; }
            public string Name { get; set; }
            public int? BFClassId { get; set; }
        }

        [Function(Name = "dbo.AttendMeetingInfo")]
        [ResultType(typeof(AttendMeetingInfo2))]
        [ResultType(typeof(Attend))] // Attendance
        [ResultType(typeof(Meeting))] // Meeting Attended
        [ResultType(typeof(Attend))] // VIP Attendance
        [ResultType(typeof(OrganizationMember))] // BFC membership
        [ResultType(typeof(Attend))] // BFC Attendance at same time
        [ResultType(typeof(Meeting))] // BFC Meeting Attended
        public IMultipleResults AttendMeetingInfo(int MeetingId, int PeopleId)
        {
            var result = this.ExecuteMethodCall(this, ((MethodInfo)(MethodInfo.GetCurrentMethod())), MeetingId, PeopleId);
            return (IMultipleResults)result.ReturnValue;
        }
        public AttendMeetingInfo1 AttendMeetingInfo0(int MeetingId, int PeopleId)
        {
            var r = AttendMeetingInfo(MeetingId, PeopleId);
            var o = new AttendMeetingInfo1();
            o.info = r.GetResult<CMSDataContext.AttendMeetingInfo2>().First();
            o.Attendance = r.GetResult<Attend>().FirstOrDefault();
            if (o.Attendance != null)
            {
                o.AttendanceOrg = new Attend
                {
                    AttendanceFlag = o.Attendance.AttendanceFlag,
                    AttendanceTypeId = o.Attendance.AttendanceTypeId,
                    AttendId = o.Attendance.AttendId,
                    CreatedBy = o.Attendance.CreatedBy,
                    CreatedDate = o.Attendance.CreatedDate,
                    EffAttendFlag = o.Attendance.EffAttendFlag,
                    MeetingDate = o.Attendance.MeetingDate,
                    MeetingId = o.Attendance.MeetingId,
                    MemberTypeId = o.Attendance.MemberTypeId,
                    OrganizationId = o.Attendance.OrganizationId,
                    OtherOrgId = o.Attendance.OtherOrgId,
                    PeopleId = o.Attendance.PeopleId,
                };
            }

            o.Meeting = r.GetResult<Meeting>().First();
            o.VIPAttendance = r.GetResult<Attend>().ToList();
            o.BFCMember = r.GetResult<OrganizationMember>().FirstOrDefault();
            o.BFCAttendance = r.GetResult<Attend>().FirstOrDefault();
            o.BFCMeeting = r.GetResult<Meeting>().FirstOrDefault();
            return o;
        }
        public string UserPreference(string pref)
        {
            return UserPreference(pref, string.Empty);
        }
        public string UserPreference(string pref, string def)
        {
            var cp = HttpContext.Current.Session["pref-" + pref];
            if (cp != null)
                return cp.ToString();
            Preference p = null;
            if (CurrentUser != null)
                p = CurrentUser.Preferences.SingleOrDefault(up => up.PreferenceX == pref);
            return p != null ? p.ValueX : def;
        }
        public void SetUserPreference(string pref, object value)
        {
            if (UserPreference(pref) == value.ToString())
                return;
            if (CurrentUser == null)
                return;
            var p = CurrentUser.Preferences.SingleOrDefault(up => up.PreferenceX == pref);
            if (p != null)
                p.ValueX = value.ToString();
            else
            {
                p = new Preference { UserId = Util.UserId1, PreferenceX = pref, ValueX = value.ToString() };
                Preferences.InsertOnSubmit(p);
            }
            HttpContext.Current.Session["pref-" + pref] = p.ValueX;
            SubmitChanges();
        }
        public ExtraDatum GetDatum<T>(T m)
        {
            var s = Util.Serialize<T>(m);
            var d = new ExtraDatum { Data = s, Stamp = Util.Now };
            ExtraDatas.InsertOnSubmit(d);
            SubmitChanges();
            return d;
        }

        [Function(Name = "dbo.LinkEnrollmentTransaction")]
        public int LinkEnrollmentTransaction([Parameter(DbType = "Int")] int? tid, [Parameter(DbType = "DateTime")] DateTime? trandt, [Parameter(DbType = "Int")] int? typeid, [Parameter(DbType = "Int")] int? orgid, [Parameter(DbType = "Int")] int? pid)
        {
            var result = this.ExecuteMethodCall(this, ((MethodInfo)(MethodInfo.GetCurrentMethod())), tid, trandt, typeid, orgid, pid);
            return ((int)(result.ReturnValue));
        }
        [Function(Name = "dbo.FlagOddTransaction")]
        public int FlagOddTransaction([Parameter(DbType = "Int")] int? pid, [Parameter(DbType = "Int")] int? orgid)
        {
            var result = this.ExecuteMethodCall(this, ((MethodInfo)(MethodInfo.GetCurrentMethod())), pid, orgid);
            return ((int)(result.ReturnValue));
        }
        [Function(Name = "dbo.PurgePerson")]
        public int PurgePerson([Parameter(DbType = "Int")] int? pid)
        {
            var result = this.ExecuteMethodCall(this, ((MethodInfo)(MethodInfo.GetCurrentMethod())), pid);
            return ((int)(result.ReturnValue));
        }
        [Function(Name = "dbo.PurgeOrganization")]
        public int PurgeOrganization([Parameter(DbType = "Int")] int? oid)
        {
            var result = this.ExecuteMethodCall(this, ((MethodInfo)(MethodInfo.GetCurrentMethod())), oid);
            return ((int)(result.ReturnValue));
        }
        [Function(Name = "dbo.UpdateMeetingCounters")]
        public int UpdateMeetingCounters([Parameter(DbType = "Int")] int? mid)
        {
            var result = this.ExecuteMethodCall(this, ((MethodInfo)(MethodInfo.GetCurrentMethod())), mid);
            return ((int)(result.ReturnValue));
        }
        [Function(Name = "dbo.DeletePeopleExtras")]
        public int DeletePeopleExtras([Parameter(DbType = "varchar(50)")] string field)
        {
            var result = this.ExecuteMethodCall(this, ((MethodInfo)(MethodInfo.GetCurrentMethod())), field);
            return ((int)(result.ReturnValue));
        }
        [Function(Name = "dbo.DeleteSpecialTags")]
        public int DeleteSpecialTags([Parameter(DbType = "Int")] int? pid)
        {
            var result = this.ExecuteMethodCall(this, ((MethodInfo)(MethodInfo.GetCurrentMethod())), pid);
            return ((int)(result.ReturnValue));
        }
        [Function(Name = "dbo.UpdateResCodes")]
        public int UpdateResCodes()
        {
            var result = this.ExecuteMethodCall(this, ((MethodInfo)(MethodInfo.GetCurrentMethod())));
            return ((int)(result.ReturnValue));
        }
        [Function(Name = "dbo.UpdateSchoolGrade")]
        public int UpdateSchoolGrade([Parameter(DbType = "Int")] int? pid)
        {
            var result = this.ExecuteMethodCall(this, ((MethodInfo)(MethodInfo.GetCurrentMethod())), pid);
            return ((int)(result.ReturnValue));
        }
        [Function(Name = "dbo.QueueEmail")]
        public int QueueEmail([Parameter(DbType = "Int")] int? id, [Parameter(DbType = "varchar(50)")] string CmsHost, [Parameter(DbType = "varchar(50)")] string Host)
        {
            var result = this.ExecuteMethodCall(this, ((MethodInfo)(MethodInfo.GetCurrentMethod())), id, CmsHost, Host);
            return ((int)(result.ReturnValue));
        }
        [Function(Name = "dbo.QueuePriorityEmail")]
        public int QueuePriorityEmail([Parameter(DbType = "Int")] int? id, [Parameter(DbType = "varchar(50)")] string CmsHost, [Parameter(DbType = "varchar(50)")] string Host)
        {
            var result = this.ExecuteMethodCall(this, ((MethodInfo)(MethodInfo.GetCurrentMethod())), id, CmsHost, Host);
            return ((int)(result.ReturnValue));
        }
        [Function(Name = "dbo.DeleteQueryBitTags")]
        public int DeleteQueryBitTags()
        {
            var result = this.ExecuteMethodCall(this, ((MethodInfo)(MethodInfo.GetCurrentMethod())));
            return ((int)(result.ReturnValue));
        }
    }
}
