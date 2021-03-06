﻿using System.Web.Mvc;
using CmsData;
using CmsWeb.Areas.Dialog.Models;
using CmsWeb.Areas.Search.Models;

namespace CmsWeb.Areas.Dialog.Controllers
{
    [RouteArea("Dialog", AreaPrefix="OrgSearchDrop"), Route("{action}/{id?}")]
    public class OrgSearchDropController : CmsStaffController
    {
        [HttpPost, Route("~/OrgSearchDrop")]
        public ActionResult Index(OrgSearchModel m)
        {
            var model = new OrgSearchDrop(m);
            model.RemoveExistingLop(DbUtil.Db, model.Id, OrgSearchDrop.Op);
            return View(model);
        }
        [HttpPost]
        public ActionResult Process(OrgSearchDrop model)
        {
            model.UpdateLongRunningOp(DbUtil.Db, OrgSearchDrop.Op);
            if (!model.Started.HasValue)
            {
                DbUtil.LogActivity($"OrgSearchDrop {model.Count} Members from {model.OrgCount} Orgs");
                model.Process(DbUtil.Db);
            }
            return View(model);
        }
    }
}
