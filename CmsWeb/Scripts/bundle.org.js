$(function(){$('a[data-toggle="tab"]').on("shown",function(l){l.preventDefault();var m=$(l.target).attr("href").replace("#","#tab-");window.location.hash=m;$.cookie("lasttab",m);return false});var f=$.cookie("lasttab");if(window.location.hash){f=window.location.hash}$("a[href='#Settings-tab']").on("shown",function(l){if($("#SettingsOrg").length<2){$("a[href='#SettingsOrg']").click().tab("show")}});$("#tab-area > ul.nav-tabs > li > a").on("shown",function(l){switch($(this).text()){case"People":$("#bluetoolbarstop li > a.qid").parent().removeClass("hidy");break;case"Settings":case"Meetings":$("#bluetoolbarstop li > a.qid").parent().addClass("hidy");break}});if(f){var j=$("a[href='"+f.replace("tab-","")+"']");var i=j.closest("ul").data("tabparent");if(i){$("a[href='#"+i+"']").click().tab("show")}if(j.attr("href")!=="#"){$.cookie("lasttab",j.attr("href"));j.click().tab("show")}}$.InitFunctions.Editable=function(){$("a.editable").editable();$("a.editable-bit").editable({type:"checklist",mode:"inline",source:{True:"True"},emptytext:"False"})};$("a.click-pencil").live("click",function(l){l.stopPropagation();$(this).prev().editable("toggle");return false});$("#excludesg").live("click",function(l){l.stopPropagation();$(this).toggleClass("active");if($(this).hasClass("active")){$("a.selectsg .fa-minus").show()}else{$("a.selectsg .fa-minus").hide()}});$("a.selectsg").live("click",function(l){l.preventDefault();var n=$(this).text();var m=$("#sgFilter").val();switch(n){case"Match All":m="All:"+m;break;case"None Assigned":m="None";break;default:if(m&&m!=="All:"){m=m+","}if($("#excludesg").hasClass("active")){n="-"+n}m=m+n;break}$("#sgFilter").val(m);$("#excludesg").removeClass("active");$("a.selectsg .fa-minus").hide();return false});$("#showhide").live("click",function(l){l.preventDefault();$(this).toggleClass("active");$("#ShowHidden").val($(this).hasClass("active"));RebindMemberGrids();return false});$("a.setfilter").live("click",function(l){l.preventDefault();$("#FilterIndividuals").val(!$("#filter-ind").hasClass("active"));RebindMemberGrids();return false});$("#filter-ind").live("click",function(l){l.preventDefault();$(this).toggleClass("active");$("#FilterIndividuals").val($(this).hasClass("active"));RebindMemberGrids();return false});$("#filter-tag").live("click",function(l){l.preventDefault();$(this).toggleClass("active");$("#FilterTag").val($(this).hasClass("active"));RebindMemberGrids();return false});$("#clear-filter").live("click",function(l){l.preventDefault();$("input[name='sgFilter']").val("");$("input[name='nameFilter']").val("");$("#FilterTag").val(false);$("#FilterIndividuals").val(false);RebindMemberGrids()});$("#ministryinfo").live("click",function(l){l.preventDefault();$(this).toggleClass("active");$("#ShowMinistryInfo").val($(this).hasClass("active"));RebindMemberGrids();return false});$("#showaddress").live("click",function(l){l.preventDefault();$(this).toggleClass("active");$("#ShowAddress").val($(this).hasClass("active"));RebindMemberGrids();return false});$("#multigroup").live("click",function(m){m.preventDefault();var l=$(this);l.toggleClass("active");var n=l.hasClass("active");$("#MultiSelect").val(n);if(n){$("#groupSelector button.dropdown-toggle").hide();$("li.orgcontext").hide()}else{$("#groupSelector button.grp.active").removeClass("active");$("#groupSelector button[value='10']").addClass("active").closest("button.dropdown-toggle").show();$("#GroupSelect").val("10");$("#showhide").removeClass("active");$("#ShowHidden").val($("#showhide").hasClass("active"))}RebindMemberGrids();return false});$("#groupSelector button.grp").live("click",function(n){n.preventDefault();var m=$(this);if($("#multigroup").hasClass("active")){m.toggleClass("active")}else{$("#groupSelector button.grp.active").removeClass("active");$("#groupSelector button.dropdown-toggle").hide();m.addClass("active");m.next().find("button.dropdown-toggle").show();$("li.orgcontext").hide();switch(m.text()){case"Members":$("li.current-list").show();break;case"Pending":$("li.pending-list").show();break}}var l="";$("#groupSelector button.grp.active").each(function(){l+=$(this).val()});if(l===""){m.toggleClass("active");return false}$("#GroupSelect").val(l);RebindMemberGrids();return false});var h=null;$("input.omck").live("click",function(m){var o=null;if(m.shiftKey&&h){var p=$("input.omck").index(this);var n=$("input.omck").index(h);o=$("input.omck").slice(Math.min(p,n),Math.max(p,n)+1);o.attr("checked",h.checked)}else{o=$(this);h=this}var l=o.map(function(){return $(this).val()}).get();$.post("/Org/ToggleCheckboxes/{0}".format($("#Id").val()),{pids:l,chkd:h.checked})});$("#deleteorg").click(function(l){l.preventDefault();var m=$(this).attr("href");if(confirm("Are you sure you want to delete?")){$.block("deleting org");$.post(m,null,function(n){if(n!="ok"){window.location=n}else{$.block("org deleted");$(".blockOverlay").attr("title","Click to unblock").click(function(){$.unblock();window.location="/"})}})}return false});$("#sendreminders").click(function(l){l.preventDefault();var m=$(this).attr("href");if(confirm("Are you sure you want to send reminders?")){$.block("sending reminders");$.post(m,null,function(n){if(n!="ok"){$.unblock();$.growlUI("error",n)}else{$.unblock();$.growlUI("Email","Reminders Sent")}})}});$("#reminderemails").click(function(l){l.preventDefault();var m=$(this).attr("href");if(confirm("Are you sure you want to send reminders?")){$.block("sending reminders");$.post(m,null,function(n){if(n!="ok"){$.block(n);$(".blockOverlay").attr("title","Click to unblock").click($.unblock)}else{$.block("org deleted");$(".blockOverlay").attr("title","Click to unblock").click(function(){$.unblock();window.location="/"})}})}return false});$(".CreateAndGo").click(function(l){l.preventDefault();if(confirm($(this).attr("confirm"))){$.post($(this).attr("href"),null,function(m){window.location=m})}return false});$("a.members-dialog").live("click",function(m){var l=$(this);m.preventDefault();$("<div />").load(this.href,{},function(){var n=$(this);var o=n.find("form");o.modal("show");$.DatePickersAndChosen();o.on("hidden",function(){n.remove();o.remove();RebindMemberGrids()})})});$("a.membertype").live("click",function(l){l.preventDefault();$("<div />").load(this.href,{},function(){var m=$(this);var n=m.find("form");n.modal("show");n.on("hidden",function(){m.remove();n.remove();RebindMemberGrids()})})});$("#orgpicklist").live("click",function(l){l.preventDefault();$("<div />").load(this.href,{},function(){var m=$(this);var n=m.find("form");n.modal("show");$.initializeSelectOrgsDialog(n);n.on("hidden",function(){m.remove();n.remove()})})});$.initializeSelectOrgsDialog=function(l){$("#select-orgs #UpdateSelected").click(function(m){m.preventDefault();var n=$("#select-orgs input[type=checkbox]:checked").map(function(){return $(this).val()}).get().join(",");k(n,l);return false});$.SaveOrgIds=function(m){var n=$("#select-orgs input[type=checkbox]:checked").map(function(){return $(this).val()}).get().join(",");$.post("/SearchOrgs/SaveOrgIds/"+$("#select-orgs #id").val(),{oids:n})};$("body").on("change","#select-orgs input:checkbox",$.SaveOrgIds)};function k(m,l){$.post("/Org/UpdateOrgIds",{id:$("#OrganizationId").val(),list:m},function(n){$("#orgpickdiv").html(n);l.modal("hide")})}$("#divisionlist").live("click",function(m){m.preventDefault();var l=$(this);$("<div />").load(l.attr("href"),{},function(){var n=$(this);var o=n.find("form");o.modal("show");o.on("hidden",function(){l.load(l.data("refresh"),{});n.remove();o.remove()});o.on("change","input:checkbox",function(){$("input[name='TargetDivision']",o).val($(this).val());$("input[name='Adding']",o).val($(this).is(":checked"));$.formAjaxClick($(this),"/SearchDivisions/AddRemoveDiv")});o.on("click","a.move",function(){$("input[name='TargetDivision']",o).val($(this).data("moveid"));$.formAjaxClick($(this),"/SearchDivisions/MoveToTop")})})});$.maxZIndex=$.fn.maxZIndex=function(m){var l={inc:10,group:"*"};$.extend(l,m);var n=0;$(l.group).each(function(){var o=parseInt($(this).css("z-index"));n=o>n?o:n});if(!this.jquery){return n}return this.each(function(){n+=l.inc;$(this).css("z-index",n)})};$.InitFunctions.popovers=function(l){$('[data-toggle="popover"]').popover({html:true,placement:"bottom"});$("body").on("click",function(m){$('[data-toggle="popover"]').each(function(){if(!$(this).is(m.target)&&$(this).has(m.target).length===0&&$(".popover").has(m.target).length===0){$(this).popover("hide")}})})};$.InitFunctions.popovers();$.InitFunctions.timepicker=function(l){$(".timepicker").datetimepicker({format:"H:ii P",showMeridian:true,autoclose:true,todayBtn:false,pickerPosition:"bottom-left",startView:1,minView:0,maxView:1});$(".datetimepicker-hours table thead, .datetimepicker-minutes table thead").attr("style","display:block; overflow:hidden; height:0;")};$.InitFunctions.ReloadMeetings=function(l){$("#Meetings-tab").load("/Org/Meetings",{id:$("input[name=Id]","#Meetings-tab").val()})};$.InitFunctions.showHideRegTypes=function(l){$("#Fees-tab").show();$("#Questions-tab").show();$("#Messages-tab").show();$("#QuestionList").show();$("#TimeSlotsList").hide();switch($("#org_RegistrationTypeId").val()){case"0":$("#Fees-tab").hide();$("#Questions-tab").hide();$("#Messages-tab").hide();break;case"6":$("#QuestionList").hide();$("#TimeSlotsList").show();break}};$("#org_RegistrationTypeId").live("change",$.InitFunctions.showHideRegTypes);$("#selectquestions a").live("click",function(l){l.preventDefault();$.post("/Org/NewAsk/",{id:"AskItems",type:$(this).attr("type")},function(n){$("#addQuestions").modal("hide");$("html, body").animate({scrollTop:$("body").height()},800);var m=$("#QuestionList").append(n);$.InitFunctions.updateQuestionList();$.InitFunctions.popovers();$.InitFunctions.movequestions()});return false});$("ul.enablesort a.del").live("click",function(l){l.preventDefault();if(!$(this).attr("href")){return false}$(this).parent().parent().parent().remove();return false});$.exceptions=["AskDropdown","AskCheckboxes","AskExtraQuestions","AskHeader","AskInstruction","AskMenu","AskText"];$.InitFunctions.updateQuestionList=function(){$("#selectquestions li").each(function(){var m=this.className;var l=$(this).text();if(!l){l=m}if($.inArray(m,$.exceptions)>=0||$("li.type-"+m).length==0){$(this).html("<a href='#' type='"+m+"'>"+l+"</a>")}else{$(this).html("<span style='text-decoration: line-through;'>"+l+"</span>")}})};$(".helptip").tooltip({showBody:"|",blocked:true});$("form.DisplayEdit a.submitbutton").live("click",function(l){l.preventDefault();var m=$(this).closest("form");if(!$(m).valid()){return false}var n=m.serialize();$.post($(this).attr("href"),n,function(o){if(o.startsWith("error:")){$("div.formerror",m).html(o.substring(6))}else{$(m).html(o).ready(function(){$(".submitbutton,.bt").button();$.regsettingeditclick(m);$.showHideRegTypes()})}});return false});$("#Future").live("click",function(){$.formAjaxClick($(this))});$.InitFunctions.CreateMeeting=function(l){};$("a.taguntag").live("click",function(l){l.preventDefault();$.post("/Org/ToggleTag/"+$(this).attr("pid"),null,function(m){$(l.target).text(m)});return false});$.validator.addMethod("time",function(m,l){return this.optional(l)||/^\d{1,2}:\d{2}\s(?:AM|am|PM|pm)/.test(m)},"time format h:mm AM/PM");$.validator.setDefaults({highlight:function(l){$(l).addClass("ui-state-highlight")},unhighlight:function(l){$(l).removeClass("ui-state-highlight")}});$("#orginfoform").validate({rules:{"org.OrganizationName":{required:true,maxlength:100}}});$("#settingsForm").validate({rules:{"org.SchedTime":{time:true},"org.OnLineCatalogSort":{digits:true},"org.Limit":{digits:true},"org.NumCheckInLabels":{digits:true},"org.NumWorkerCheckInLabels":{digits:true},"org.FirstMeetingDate":{date:true},"org.LastMeetingDate":{date:true},"org.RollSheetVisitorWks":{digits:true},"org.GradeAgeStart":{digits:true},"org.GradeAgeEnd":{digits:true},"org.Fee":{number:true},"org.Deposit":{number:true},"org.ExtraFee":{number:true},"org.ShirtFee":{number:true},"org.ExtraOptionsLabel":{maxlength:50},"org.OptionsLabel":{maxlength:50},"org.NumItemsLabel":{maxlength:50},"org.GroupToJoin":{digits:true},"org.RequestLabel":{maxlength:50},"org.DonationFundId":{number:true}}});$("#nameFilter").live("keypress",function(l){if((l.keyCode||l.which)===13){l.preventDefault();RebindMemberGrids()}return true});$("#addsch").live("click",function(l){l.preventDefault();var n=$(this).attr("href");if(n){var m=$(this).closest("form");$.post(n,null,function(o){$("#schedules").append(o).ready(function(){$.InitFunctions.timepicker();$.renumberListItems()})})}return false});$("a.delete-well").live("click",function(l){l.preventDefault();$(this).closest("div.well").remove();$.renumberListItems()});$.renumberListItems=function(){var l=1;$(".renumberMe").each(function(){$(this).val(l);l++})};$("#ScheduleListPrev").change(function(){var l=$(this).val().split(",");$("#PrevMeetingDate").val(l[0]);$("#NewMeetingTime").val(l[1]);$("#AttendCreditList").val(l[2])});$("#ScheduleListNext").change(function(){var l=$(this).val().split(",");$("#NextMeetingDate").val(l[0]);$("#NewMeetingTime").val(l[1]);$("#AttendCreditList").val(l[2])});$.GetPrevMeetingDateTime=function(){var l=$("#PrevMeetingDate").val();return $.GetMeetingDateTime(l)};$.GetNextMeetingDateTime=function(){var l=$("#NextMeetingDate").val();return $.GetMeetingDateTime(l)};$.GetMeetingDateTime=function(l){var m=/^ *(\d{1,2}):[0-5][0-9] *((a|p|A|P)(m|M)){0,1} *$/;var n=$("#NewMeetingTime").val();var o=true;if(!m.test(n)){$.growlUI("error","enter valid time");o=false}if(!$.DateValid(l)){$.growlUI("error","enter valid date");o=false}return{date:l,time:n,valid:o}};$("a.joinlink").live("click",function(m){m.preventDefault();var l=$(this);bootbox.confirm(l.attr("confirm"),function(n){if(n){$.post(l[0].href,function(o){if(o==="ok"){RebindMemberGrids()}else{alert(o)}})}});return false});$.extraEditable=function(){$(".editarea").editable("/Organization/EditExtra/",{type:"textarea",submit:"OK",rows:5,width:200,indicator:'<img src="/Content/images/loading.gif">',tooltip:"Click to edit..."});$(".editline").editable("/Organization/EditExtra/",{indicator:"<img src='/Content/images/loading.gif'>",tooltip:"Click to edit...",style:"display: inline",width:200,height:25,submit:"OK"})};$.extraEditable();$("a.deleteextra").live("click",function(l){l.preventDefault();if(confirm("are you sure?")){$.post("/Organization/DeleteExtra/"+$("#OrganizationId").val(),{field:$(this).attr("field")},function(m){if(m.startsWith("error")){alert(m)}else{$("#extras > tbody").html(m);$.extraEditable()}})}return false});$.updateTable=function(m){if(!m){return false}var l=m.closest("form.ajax");if(l.length){$.formAjaxClick(m)}return false};$.InitFunctions.ReloadPeople=function(){RebindMemberGrids()};$("body").on("click","div.newitem > a",function(m){if(!$(this).attr("href")){return false}m.preventDefault();var l=$(this);var n=l.closest("form");$.post(l.attr("href"),null,function(o){l.parent().prev().append(o);$.InitFunctions.movequestions()})});function a(){$("div.movable-list").each(function(){$(this).children("div.movable").each(function(){$(this).removeClass("cutting")})})}function e(){$("div.movable-list").each(function(){if($(this).children("div.movable").length<=1){$(this).children("div.movable").find("div a.cut").addClass("disabled")}$(this).children("div.movable").find("div a.paste").addClass("disabled")})}function d(l){$(l).children("div.movable").each(function(){$(this).find("div a.paste").first().removeClass("disabled")})}function c(){$("div.movable-list").each(function(){$(this).children("div.movable").find("div a.movetop").removeClass("disabled");$(this).children("div.movable").find("div a.moveup").removeClass("disabled");$(this).children("div.movable").first().find("div a.movetop").addClass("disabled");$(this).children("div.movable").first().find("div a.moveup").addClass("disabled")})}function b(){$("div.movable-list").each(function(){$(this).children("div.movable").find("div a.movebottom").removeClass("disabled");$(this).children("div.movable").find("div a.movedown").removeClass("disabled");$(this).children("div.movable").last().find("div a.movebottom").addClass("disabled");$(this).children("div.movable").last().find("div a.movedown").addClass("disabled")})}function g(l,m,n){n.preventDefault();if($(l).hasClass("disabled")){return false}var u=$(l).closest("div.movable-list");var t=$(l).closest("div.movable");switch(m){case"top":var p=$(u).children("div.movable").first();$(t).clone(true,true).insertBefore(p);break;case"up":var s=t.prev("div.movable");$(t).clone(true,true).insertBefore(s);break;case"cut":a();$(t).addClass("cutting");d(u);return false;break;case"paste":var o=$(l).closest("div.movable");t=$(u).children("div.cutting").first();$(t).clone(true,true).insertAfter(o);break;case"down":var r=t.next("div.movable");$(t).clone(true,true).insertAfter(r);break;case"bottom":var q=$(u).children("div.movable").last();$(t).clone(true,true).insertAfter(q);break;case"delconfirm":if(!$(l).attr("href")){return false}if(!confirm("are you sure?")){return false}break;case"delete":if(!$(l).attr("href")){return false}break}$(t).remove();$.InitFunctions.updateQuestionList();$.InitFunctions.movequestions()}$.InitFunctions.movequestions=function(){a();e();c();b();$("body a.movetop").off().on("click",function(l){g($(this),"top",l)});$("body a.moveup").off().on("click",function(l){g($(this),"up",l)});$("body a.cut").off().on("click",function(l){g($(this),"cut",l)});$("body a.paste").off().on("click",function(l){g($(this),"paste",l)});$("body a.movedown").off().on("click",function(l){g($(this),"down",l)});$("body a.movebottom").off().on("click",function(l){g($(this),"bottom",l)});$("body a.delconfirm").off().on("click",function(l){g($(this),"delconfirm",l)});$("body a.delete").off().on("click",function(l){g($(this),"delete",l)})};$.InitFunctions.movequestions()});function RebindMemberGrids(){$.formAjaxClick($("a.setfilter"))}function AddSelected(){RebindMemberGrids()}function CloseAddDialog(a){$("#memberDialog").dialog("close")};(function(a){a.fn.SearchUsers=function(c){b(this);var d=a.extend({},{},c);return this.each(function(){var e=a(this);e.click(function(f){f.preventDefault();var g=a(this).attr("href");a("<div />").load(g,{},function(){var h=a(this);var i=h.find("form");i.modal("show");a(i).off("click",".UpdateSelected");a(i).on("click",".UpdateSelected",function(j){j.preventDefault();var k=a("table.results tbody tr:first ",i).find("input[type=checkbox]").attr("value");var l=a("#topid0").val();if(d.UpdateShared){d.UpdateShared(k,l,e)}i.modal("hide");return false});a(i).off("keypress","#searchname");a(i).on("keypress","#searchname",function(j){if((j.which&&j.which==13)||(j.keyCode&&j.keyCode==13)){j.preventDefault();a("a.search").click();return false}return true});a(i).off("click","input[type='checkbox']");a(i).on("change","input[type='checkbox']",function(){var m=a(this).parents("tr:eq(0)").find("span.move");var j=a(this).is(":checked");var l=a(this).attr("value");var k=a("#ordered").val();a.post("/SearchUsers/TagUntag/"+l,{ischecked:!j,isordered:k},function(n){if(j&&!n){m.html("<a href='#' class='move' value='"+l+"'>move to top</a>")}else{m.empty()}if(n){a("#topid").val(l)}})});a(i).off("click","a.move");a(i).on("click","a.move",function(j){j.preventDefault();var k=a(this).closest("form");a("#topid").val(a(this).attr("value"));var l=k.serialize();a.post("/SearchUsers/MoveToTop",l,function(m){a("table.results",k).replaceWith(m).ready(function(){a("table.results > tbody > tr:even",k).addClass("alt")})})});i.on("hidden",function(){h.remove();i.remove()})});return false})})};function b(c){if(window.console&&window.console.log){window.console.log("SearchUsers selection count: "+c.size())}}})(jQuery);$(function(){CKEDITOR.replace("editor",{height:200,customConfig:"/scripts/js/ckeditorconfig.js"});$.InitFunctions.SettingFormsInit=function(a){$("a.notifylist").SearchUsers({UpdateShared:function(c,d,b){$.post("/Org/UpdateNotifyIds",{id:$("#OrganizationId").val(),topid:c,field:b.data("field")},function(e){b.html(e)})}})};$("a.editor").live("click",function(a){if(!$(this).attr("href")){return false}var b=$(this).attr("tb");a.preventDefault();CKEDITOR.instances.editor.setData($("#"+b).val());dimOn();$("#EditorDialog").center().show();$("#saveedit").off("click").on("click",function(c){c.preventDefault();var d=CKEDITOR.instances.editor.getData();$("#"+b).val(d);$("#"+b+"_ro").html(d);CKEDITOR.instances.editor.setData("");$("#EditorDialog").hide("close");dimOff();return false});return false});$("#canceledit").live("click",function(a){a.preventDefault();$("#EditorDialog").hide("close");dimOff();return false})});CKEDITOR.on("dialogDefinition",function(d){var c=d.data.name;var b=d.data.definition;if(c=="link"){var a=b.getContents("advanced");a.label="SpecialLinks";a.remove("advCSSClasses");a.remove("advCharset");a.remove("advContentType");a.remove("advStyles");a.remove("advAccessKey");a.remove("advName");a.remove("advId");a.remove("advTabIndex");var g=a.get("advRel");g.label="Sub-Group";var h=a.get("advTitle");h.label="Message";var e=a.get("advLangCode");e.label="OrgId/MeetingId";var f=a.get("advLangDir");f.label="Confirmation";f.items[1][0]="Yes, send confirmation";f.items[2][0]="No, do not send confirmation"}});$(function(){$("#membergroups .ckbox").live("click",function(a){$.post($(this).attr("href"),{ck:$(this).is(":checked")});return true});$("#membergroups .update-smallgroup").live("click",function(a){a.preventDefault();var b=$(this).attr("href");var c="This will add or remove everybody to/from this sub-group. Are you sure?";bootbox.confirm(c,function(d){if(d){$.post(b)}});return false});$("#dropmember").live("click",function(a){var b=$(this).closest("form");var c=this.href;bootbox.confirm("are you sure?",function(d){if(d){$.post(c,null,function(e){b.modal("hide");RebindMemberGrids()})}});return false});$("#OrgSearch").live("keydown",function(a){if(a.keyCode===13){a.preventDefault();$("#orgsearchbtn").click()}});$("a.movemember").live("click",function(a){a.preventDefault();var b=$(this).closest("form");var c=$(this).attr("href");bootbox.confirm("are you sure?",function(d){if(d){$.post(c,null,function(e){b.modal("hide");$.RebindMemberGrids()})}});return false})});