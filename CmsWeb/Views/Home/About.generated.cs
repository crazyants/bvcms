﻿#pragma warning disable 1591
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.239
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CmsWeb.Views.Home
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Text;
    using System.Web;
    using System.Web.Helpers;
    using System.Web.Mvc;
    using System.Web.Mvc.Ajax;
    using System.Web.Mvc.Html;
    using System.Web.Routing;
    using System.Web.Security;
    using System.Web.UI;
    using System.Web.WebPages;
    using CmsData;
    using CmsWeb;
    using UtilityExtensions;
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("RazorGenerator", "1.3.2.0")]
    [System.Web.WebPages.PageVirtualPathAttribute("~/Views/Home/About.cshtml")]
    public class About : System.Web.Mvc.WebViewPage<dynamic>
    {
        public About()
        {
        }
        public override void Execute()
        {

            
            #line 1 "..\..\Views\Home\About.cshtml"
  
    ViewBag.Title = "About Us";
    Layout = "~/Views/Shared/SiteLayout.cshtml";


            
            #line default
            #line hidden
WriteLiteral("<h2>About</h2>\r\n<p>Build Version: ");


            
            #line 6 "..\..\Views\Home\About.cshtml"
             Write(ViewData["build"]);

            
            #line default
            #line hidden
WriteLiteral("</p>\r\n\r\n\r\n");


        }
    }
}
#pragma warning restore 1591