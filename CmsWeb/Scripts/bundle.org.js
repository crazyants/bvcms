onload=function(){var a=document.getElementById("refreshed");if(a.value=="no"){a.value="yes"}else{a.value="no";location.reload()}};$(function(){$('a[data-toggle="tab"]').on("shown",function(d){d.preventDefault();var f=$(d.target).attr("href").replace("#","#tab-");window.location.hash=f;$.cookie("lasttab",f);return false});var a=$.cookie("lasttab");if(window.location.hash){a=window.location.hash}if(a){var c=$("a[href='"+a.replace("tab-","")+"']");var b=c.closest("ul").data("tabparent");if(b){$("a[href='#"+b+"']").click().tab("show")}if(c.attr("href")!=="#"){$.cookie("lasttab",c.attr("href"));c.click().tab("show")}}$("a[href='#Settings-tab']").on("shown",function(d){if($("#SettingsOrg").length<2){$("a[href='#SettingsOrg']").click().tab("show")}});$("#tab-area > ul.nav-tabs > li > a").on("shown",function(d){var f="";switch($(this).text()){case"Members":f=$("#currentQid").val();$("#bluetoolbarstop li > a.qid").parent().removeClass("hidy");$("li.current-list").show();break;case"Previous":f=$("#previousQid").val();$("#bluetoolbarstop li > a.qid").parent().removeClass("hidy");$("li.orgcontext").hide();break;case"Pending":f=$("#pendingQid").val();$("#bluetoolbarstop li > a.qid").parent().removeClass("hidy");$("li.orgcontext").hide();$("li.pending-list").show();break;case"Inactive":case"Senders":f=$("#inactiveQid").val();$("#bluetoolbarstop li > a.qid").parent().removeClass("hidy");$("li.orgcontext").hide();break;case"Prospects":f=$("#prospectsQid").val();$("#bluetoolbarstop li > a.qid").parent().removeClass("hidy");$("li.orgcontext").hide();break;case"Guests":f=$("#visitedQid").val();$("#bluetoolbarstop li > a.qid").parent().removeClass("hidy");$("li.orgcontext").hide();break;case"Settings":case"Meetings":$("#bluetoolbarstop li > a.qid").parent().addClass("hidy");break}if(f){$("#bluetoolbarstop a.qid").each(function(){$(this).attr("href",this.href.replace(/(.*\/)([^\/?]*)(\?[^?]*)?$/mg,"$1"+f+"$3"))})}});$("#deleteorg").click(function(d){d.preventDefault();var e=$(this).attr("href");if(confirm("Are you sure you want to delete?")){$.block("deleting org");$.post(e,null,function(f){if(f!="ok"){window.location=f}else{$.block("org deleted");$(".blockOverlay").attr("title","Click to unblock").click(function(){$.unblock();window.location="/"})}})}return false});$("#sendreminders").click(function(d){d.preventDefault();var e=$(this).attr("href");if(confirm("Are you sure you want to send reminders?")){$.block("sending reminders");$.post(e,null,function(f){if(f!="ok"){$.unblock();$.growlUI("error",f)}else{$.unblock();$.growlUI("Email","Reminders Sent")}})}});$("#reminderemails").click(function(d){d.preventDefault();var e=$(this).attr("href");if(confirm("Are you sure you want to send reminders?")){$.block("sending reminders");$.post(e,null,function(f){if(f!="ok"){$.block(f);$(".blockOverlay").attr("title","Click to unblock").click($.unblock)}else{$.block("org deleted");$(".blockOverlay").attr("title","Click to unblock").click(function(){$.unblock();window.location="/"})}})}return false});$(".CreateAndGo").click(function(d){d.preventDefault();if(confirm($(this).attr("confirm"))){$.post($(this).attr("href"),null,function(e){window.location=e})}return false});$("a.addfromtag").live("click",function(g){g.preventDefault();var f=$("#AddFromTag");$("iframe",f).attr("src",this.href);f.dialog("option","title","Add Members From Tag");f.dialog("open")});$("#RepairTransactions").live("click",function(g){g.preventDefault();var f=$("#LongRunOp");$("iframe",f).attr("src",this.href);f.dialog("option","title","Repair Transactions");f.dialog("open")});$("a.delmeeting").live("click",function(f){f.preventDefault();if(confirm("delete meeting for sure?")){var e=$("#LongRunOp");$("iframe",e).attr("src",this.href);e.dialog("option","title","Delete Meeting");e.dialog("open")}return false});$("a.addmembers").live("click",function(g){g.preventDefault();var f=$("#memberDialog");$("iframe",f).attr("src",this.href);f.dialog("option","title","Add Members");f.dialog("open")});$("a.memberdialog").live("click",function(g){g.preventDefault();var h;var f=$("#memberDialog");$("iframe",f).attr("src",this.href);f.dialog("option","title",this.title||"Edit Member Dialog");f.dialog("open")});$("a.membertype").live("click",function(d){d.preventDefault();$("<div />").load(this.href,{},function(){var e=$(this);var g=e.find("form");g.modal("show");g.on("hidden",function(){e.remove();g.remove()})})});$("#divisionlist").live("click",function(e){e.preventDefault();var d=$(this);$("<div />").load(d.attr("href"),{},function(){var g=$(this);var h=g.find("form");h.modal("show");h.on("hidden",function(){d.load(d.data("refresh"),{});g.remove();h.remove()});h.on("change","input:checkbox",function(){$("input[name='TargetDivision']",h).val($(this).val());$("input[name='Adding']",h).val($(this).is(":checked"));$.formAjaxClick($(this),"/SearchDivisions/AddRemoveDiv")});h.on("click","a.move",function(){$("input[name='TargetDivision']",h).val($(this).data("moveid"));$.formAjaxClick($(this),"/SearchDivisions/MoveToTop")})})});$.maxZIndex=$.fn.maxZIndex=function(e){var d={inc:10,group:"*"};$.extend(d,e);var f=0;$(d.group).each(function(){var g=parseInt($(this).css("z-index"));f=g>f?g:f});if(!this.jquery){return f}return this.each(function(){f+=d.inc;$(this).css("z-index",f)})};$.InitFunctions.showHideRegTypes=function(d){$("#Fees-tab").show();$("#Questions-tab").show();$("#Messages-tab").show();$("#QuestionList li").show();$(".yes6").hide();switch($("#org_RegistrationTypeId").val()){case"0":$("#Fees-tab").hide();$("#Questions-tab").hide();$("#Messages-tab").hide();break;case"6":$("#QuestionList > li").hide();$(".yes6").show();break}};$("#org_RegistrationTypeId").live("change",$.InitFunctions.showHideRegTypes);$("#selectquestions a").live("click",function(d){d.preventDefault();$.post("/Organization/NewAsk/",{id:"AskItems",type:$(this).attr("type")},function(f){$("#selectquestions").dialog("close");$("html, body").animate({scrollTop:$("body").height()},800);var e=$("#QuestionList").append(f);$("#QuestionList > li:last").effect("highlight",{},3000);$(".tip",e).tooltip({opacity:0,showBody:"|"});$.updateQuestionList()});return false});$("ul.enablesort a.del").live("click",function(d){d.preventDefault();if(!$(this).attr("href")){return false}$(this).parent().parent().parent().remove();return false});$("ul.enablesort a.delt").live("click",function(d){d.preventDefault();if(!$(this).attr("href")){return false}if(confirm("are you sure?")){$(this).parent().parent().remove();$.InitFunctions.updateQuestionList()}return false});$.exceptions=["AskDropdown","AskCheckboxes","AskExtraQuestions","AskHeader","AskInstruction","AskMenu"];$.InitFunctions.updateQuestionList=function(){$("#selectquestions li").each(function(){var e=this.className;var d=$(this).text();if(!d){d=e}if($.inArray(e,$.exceptions)>=0||$("li.type-"+e).length==0){$(this).html("<a href='#' type='"+e+"'>"+d+"</a>")}else{$(this).html("<span>"+d+"</span>")}})};$(".helptip").tooltip({showBody:"|",blocked:true});$("form.DisplayEdit a.submitbutton").live("click",function(d){d.preventDefault();var e=$(this).closest("form");if(!$(e).valid()){return false}var g=e.serialize();$.post($(this).attr("href"),g,function(f){if(f.startsWith("error:")){$("div.formerror",e).html(f.substring(6))}else{$(e).html(f).ready(function(){$(".submitbutton,.bt").button();$.regsettingeditclick(e);$.showHideRegTypes()})}});return false});$("#future").live("click",function(){var d=$(this).closest("form");var e=d.serialize();$.post($(d).attr("action"),e,function(f){$(d).html(f);$(".bt",d).button()})});$("a.taguntag").live("click",function(d){d.preventDefault();$.post("/Organization/ToggleTag/"+$(this).attr("pid"),null,function(e){$(d.target).text(e)});return false});$.validator.addMethod("time",function(e,d){return this.optional(d)||/^\d{1,2}:\d{2}\s(?:AM|am|PM|pm)/.test(e)},"time format h:mm AM/PM");$.validator.setDefaults({highlight:function(d){$(d).addClass("ui-state-highlight")},unhighlight:function(d){$(d).removeClass("ui-state-highlight")}});$("#orginfoform").validate({rules:{"org.OrganizationName":{required:true,maxlength:100}}});$("#settingsForm").validate({rules:{"org.SchedTime":{time:true},"org.OnLineCatalogSort":{digits:true},"org.Limit":{digits:true},"org.NumCheckInLabels":{digits:true},"org.NumWorkerCheckInLabels":{digits:true},"org.FirstMeetingDate":{date:true},"org.LastMeetingDate":{date:true},"org.RollSheetVisitorWks":{digits:true},"org.GradeAgeStart":{digits:true},"org.GradeAgeEnd":{digits:true},"org.Fee":{number:true},"org.Deposit":{number:true},"org.ExtraFee":{number:true},"org.ShirtFee":{number:true},"org.ExtraOptionsLabel":{maxlength:50},"org.OptionsLabel":{maxlength:50},"org.NumItemsLabel":{maxlength:50},"org.GroupToJoin":{digits:true},"org.RequestLabel":{maxlength:50},"org.DonationFundId":{number:true}}});$("#namefilter").keypress(function(d){if((d.keyCode||d.which)==13){d.preventDefault();$.formAjaxClick($(this))}return true});$("#addsch").live("click",function(d){d.preventDefault();var g=$(this).attr("href");if(g){var e=$(this).closest("form");$.post(g,null,function(f){$("#schedules",e).append(f).ready(function(){$.renumberListItems();$.initDatePicker(e)})})}return false});$("a.deleteschedule").live("click",function(d){d.preventDefault();var e=$(this).attr("href");if(e){$(this).parent().remove();$.renumberListItems()}});$.renumberListItems=function(){var d=1;$(".renumberMe").each(function(){$(this).val(d);d++})};$("#ScheduleListPrev").change(function(){var d=$(this).val().split(",");$("#PrevMeetingDate").val(d[0]);$("#NewMeetingTime").val(d[1]);$("#AttendCreditList").val(d[2])});$("#ScheduleListNext").change(function(){var d=$(this).val().split(",");$("#NextMeetingDate").val(d[0]);$("#NewMeetingTime").val(d[1]);$("#AttendCreditList").val(d[2])});$.GetPrevMeetingDateTime=function(){var e=$("#PrevMeetingDate").val();return $.GetMeetingDateTime(e)};$.GetNextMeetingDateTime=function(){var e=$("#NextMeetingDate").val();return $.GetMeetingDateTime(e)};$.GetMeetingDateTime=function(e){var f=/^ *(\d{1,2}):[0-5][0-9] *((a|p|A|P)(m|M)){0,1} *$/;var g=$("#NewMeetingTime").val();var h=true;if(!f.test(g)){$.growlUI("error","enter valid time");h=false}if(!$.DateValid(e)){$.growlUI("error","enter valid date");h=false}return{date:e,time:g,valid:h}};$("a.joinlink").live("click",function(e){e.preventDefault();var d=$(this);bootbox.confirm(d.attr("confirm"),function(f){if(f){$.post(d[0].href,function(g){if(g=="ok"){$.RebindMemberGrids()}else{alert(g)}})}});return false});$.extraEditable=function(){$(".editarea").editable("/Organization/EditExtra/",{type:"textarea",submit:"OK",rows:5,width:200,indicator:'<img src="/Content/images/loading.gif">',tooltip:"Click to edit..."});$(".editline").editable("/Organization/EditExtra/",{indicator:"<img src='/images/loading.gif'>",tooltip:"Click to edit...",style:"display: inline",width:200,height:25,submit:"OK"})};$.extraEditable();$("a.deleteextra").live("click",function(d){d.preventDefault();if(confirm("are you sure?")){$.post("/Organization/DeleteExtra/"+$("#OrganizationId").val(),{field:$(this).attr("field")},function(e){if(e.startsWith("error")){alert(e)}else{$("#extras > tbody").html(e);$.extraEditable()}})}return false});$.updateTable=function(e){if(!e){return false}var d=e.closest("form.ajax");if(d.length){$.formAjaxClick(e)}return false};$.RebindMemberGrids=function(){$.updateTable($("#Members-tab a.setfilter"));$.updateTable($("#Inactive-tab a.setfilter"));$.updateTable($("#Pending-tab a.setfilter"));$.updateTable($("#Priors-tab a.setfilter"));$.updateTable($("#Prospects-tab a.setfilter"));$.updateTable($("#Visitors-tab a.setfilter"))}});function AddSelected(){$.RebindMemberGrids()}function CloseAddDialog(a){$("#memberDialog").dialog("close")}function UpdateSelectedUsers(a){}function UpdateSelectedOrgs(a){$.post("/Organization/UpdateOrgIds",{id:$("#OrganizationId").val(),list:a},function(b){$("#orgpickdiv").html(b);$("#orgsDialog").dialog("close")})};(function(a){a.fn.SearchUsers=function(c){b(this);var d=a.extend({},{},c);return this.each(function(){var e=a(this);e.click(function(f){f.preventDefault();var g=a(this).attr("href");a("<div class='dialog' style='margin: 5px'>Loading...</div>").dialog({closeOnEscape:true,title:d.title||"Select Users",width:"550px"}).bind("dialogclose",function(){a(this).dialog("destroy")}).load(g,function(){var h=a(this);h.dialog("option","position",["center","center"]);h.dialog("option","width",h.offsetWidth+10);a("table.results > tbody > tr:even",h).addClass("alt");a(".bt").button();a(".UpdateSelected",a(this)).click(function(j){j.preventDefault();var k=a("table.results tbody tr:first ",h).find("input[type=checkbox]").attr("value");var l=a("#topid0").val();if(d.UpdateShared){d.UpdateShared(k,l,e)}h.dialog("close");return false});var i=a("a.search",h).closest("form");i.submit(function(){a("a.search",h).click();return false});a("a.newsearch",h).click(function(j){j.preventDefault();a("#searchname").val("");var k=i.serialize();a.post(a(this).attr("href"),k,function(l){a("table.results",i).replaceWith(l);a("table.results > tbody > tr:even",i).addClass("alt")});return false});a("a.search",h).click(function(j){j.preventDefault();var k=i.serialize();a.post(a(this).attr("href"),k,function(l){a("table.results",i).replaceWith(l);a("table.results > tbody > tr:even",i).addClass("alt")});return false});a("a.close",h).click(function(j){j.preventDefault();h.dialog("close");return false});a("#searchname").live("keypress",function(j){if((j.which&&j.which==13)||(j.keyCode&&j.keyCode==13)){j.preventDefault();a("a.search").click();return false}return true});a(h).off("click","input[type=checkbox]");a(h).on("change","input[type=checkbox]",function(){var m=a(this).parents("tr:eq(0)").find("span.move");var j=a(this).is(":checked");var l=a(this).attr("value");var k=a("#ordered").val();a.post("/SearchUsers/TagUntag/"+l,{ischecked:!j,isordered:k},function(n){if(j&&!n){m.html("<a href='#' class='move' value='"+l+"'>move to top</a>")}else{m.empty()}if(n){a("#topid").val(l)}})});a(h).off("click","a.move");a(h).on("click","a.move",function(j){j.preventDefault();var k=a(this).closest("form");a("#topid").val(a(this).attr("value"));var l=k.serialize();a.post("/SearchUsers/MoveToTop",l,function(m){a("table.results",k).replaceWith(m).ready(function(){a("table.results > tbody > tr:even",k).addClass("alt")})})})});return false})})};function b(c){if(window.console&&window.console.log){window.console.log("SearchUsers selection count: "+c.size())}}})(jQuery);$(function(){CKEDITOR.replace("editor",{height:200,customConfig:"/scripts/js/ckeditorconfig.js"});$("body").on("click","ul.enablesort div.newitem > a",function(c){if(!$(this).attr("href")){return false}c.preventDefault();var b=$(this);var d=b.closest("form");$.post(b.attr("href"),null,function(a){b.parent().prev().append(a);b.parent().prev().find(".tip").tooltip({opacity:0,showBody:"|"});$.initDatePicker(d)})});$.InitFunctions.SettingFormsInit=function(a){$(".tip",a).tooltip({opacity:0,showBody:"|"});$("ul.noedit input",a).attr("disabled","disabled");$("ul.noedit select",a).attr("disabled","disabled");$("ul.noedit a",a).not('[target="otherorg"]').removeAttr("href");$("ul.noedit a",a).not('[target="otherorg"]').css("color","grey");$("ul.noedit a",a).not('[target="otherorg"]').unbind("click");$("ul.edit a.notifylist").SearchUsers({UpdateShared:function(c,d,b){$.post("/Organization/UpdateNotifyIds",{id:$("#OrganizationId").val(),topid:c,field:b.data("field")},function(e){b.html(e)})}})};$("a.editor").live("click",function(a){if(!$(this).attr("href")){return false}var b=$(this).attr("tb");a.preventDefault();CKEDITOR.instances.editor.setData($("#"+b).val());dimOn();$("#EditorDialog").center().show();$("#saveedit").off("click").on("click",function(c){c.preventDefault();var d=CKEDITOR.instances.editor.getData();$("#"+b).val(d);$("#"+b+"_ro").html(d);CKEDITOR.instances.editor.setData("");$("#EditorDialog").hide("close");dimOff();return false});return false});$("#canceledit").live("click",function(a){a.preventDefault();$("#EditorDialog").hide("close");dimOff();return false})});CKEDITOR.on("dialogDefinition",function(d){var c=d.data.name;var b=d.data.definition;if(c=="link"){var a=b.getContents("advanced");a.label="SpecialLinks";a.remove("advCSSClasses");a.remove("advCharset");a.remove("advContentType");a.remove("advStyles");a.remove("advAccessKey");a.remove("advName");a.remove("advId");a.remove("advTabIndex");var g=a.get("advRel");g.label="SmallGroup";var h=a.get("advTitle");h.label="Message";var e=a.get("advLangCode");e.label="OrgId/MeetingId";var f=a.get("advLangDir");f.label="Confirmation";f.items[1][0]="Yes, send confirmation";f.items[2][0]="No, do not send confirmation"}});$(function(){$("#membergroups .ckbox").live("click",function(a){$.post($(this).attr("href"),{ck:$(this).is(":checked")});return true});$("#dropmember").live("click",function(a){var b=$(this).closest("form");var c=this.href;bootbox.confirm("are you sure?",function(d){if(d){$.post(c,null,function(e){b.modal("hide");$.RebindMemberGrids()})}});return false});$("#OrgSearch").live("keydown",function(a){if(a.keyCode==13){a.preventDefault();$("#orgsearchbtn").click()}});$("a.movemember").live("click",function(a){a.preventDefault();var b=$(this).closest("form");var c=$(this).attr("href");bootbox.confirm("are you sure?",function(d){if(d){$.post(c,null,function(e){b.modal("hide");$.RebindMemberGrids()})}});return false})});