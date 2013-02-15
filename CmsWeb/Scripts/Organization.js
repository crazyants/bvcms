﻿onload = function() {
    var e = document.getElementById("refreshed");
    if (e.value == "no")
        e.value = "yes";
    else {
        e.value = "no";
        location.reload();
    }
};
$(function () {
    $("#Settings-tab").tabs();
    $("#main-tab").tabs();
    $("#main-tab").show();
    $('#deleteorg').click(function (ev) {
        ev.preventDefault();
        var href = $(this).attr("href");
        if (confirm('Are you sure you want to delete?')) {
            $.block("deleting org");
            $.post(href, null, function (ret) {
                if (ret != "ok") {
                    $.block(ret);
                    $('.blockOverlay').attr('title', 'Click to unblock').click($.unblock);
                }
                else {
                    $.block("org deleted");
                    $('.blockOverlay').attr('title', 'Click to unblock').click(function () {
                        $.unblock();
                        window.location = "/";
                    });
                }
            });
        }
        return false;
    });
    $('#sendreminders').click(function (ev) {
        ev.preventDefault();
        var href = $(this).attr("href");
        if (confirm('Are you sure you want to send reminders?')) {
            $.block("sending reminders");
            $.post(href, null, function (ret) {
                if (ret != "ok") {
                    $.unblock();
                    $.growlUI("error", ret);
                }
                else {
                    $.unblock();
                    $.growlUI("Email", "Reminders Sent");
                }
            });
        }
    });
    $('#reminderemails').click(function (ev) {
        ev.preventDefault();
        var href = $(this).attr("href");
        if (confirm('Are you sure you want to send reminders?')) {
            $.block("sending reminders");
            $.post(href, null, function (ret) {
                if (ret != "ok") {
                    $.block(ret);
                    $('.blockOverlay').attr('title', 'Click to unblock').click($.unblock);
                }
                else {
                    $.block("org deleted");
                    $('.blockOverlay').attr('title', 'Click to unblock').click(function () {
                        $.unblock();
                        window.location = "/";
                    });
                }
            });
        }
        return false;
    });
    $(".bt").button();

    $('form table.grid > tbody > tr:even').addClass('alt');

    $(".CreateAndGo").click(function (ev) {
        ev.preventDefault();
        if (confirm($(this).attr("confirm")))
            $.post($(this).attr("href"), null, function (ret) {
                window.location = ret;
            });
        return false;
    });
    $('#memberDialog').dialog({
        title: 'Add Members Dialog',
        bgiframe: true,
        autoOpen: false,
        zindex: 9999,
        width: 750,
        height: 700,
        modal: true,
        overlay: {
            opacity: 0.5,
            background: "black"
        }, close: function () {
            $('iframe', this).attr("src", "");
        }
    });
    $('#AddFromTag').dialog({
        title: 'Add From Tag',
        bgiframe: true,
        autoOpen: false,
        width: 750,
        height: 650,
        modal: true,
        overlay: {
            opacity: 0.5,
            background: "black"
        }, close: function () {
            $('iframe', this).attr("src", "");
            RebindMemberGrids();
        }
    });
    $('body').on("click", 'a.addfromtag', function (e) {
        e.preventDefault();
        var d = $('#AddFromTag');
        $('iframe', d).attr("src", this.href);
        d.dialog("option", "title", "Add Members From Tag");
        d.dialog("open");
    });
    $('#LongRunOp').dialog({
        bgiframe: true,
        autoOpen: false,
        width: 600,
        height: 400,
        modal: true,
        overlay: {
            opacity: 0.5,
            background: "black"
        }, close: function () {
            $('iframe', this).attr("src", "");
            RebindMemberGrids();
            $.updateTable($('#Meetings-tab form'));
        }
    });
    $('body').on("click", '#RepairTransactions', function (e) {
        e.preventDefault();
        var d = $('#LongRunOp');
        $('iframe', d).attr("src", this.href);
        d.dialog("option", "title", "Repair Transactions");
        d.dialog("open");
    });
    $('body').on('click', '.delmeeting', function (ev) {
        ev.preventDefault();
        if (confirm("delete meeting for sure?")) {
            var d = $('#LongRunOp');
            $('iframe', d).attr("src", this.href);
            d.dialog("option", "title", "Delete Meeting");
            d.dialog("open");
        }
        return false;
    });


    $('body').on("click", 'a.addmembers', function (e) {
        e.preventDefault();
        var d = $('#memberDialog');
        $('iframe', d).attr("src", this.href);
        d.dialog("option", "title", "Add Members");
        d.dialog("open");
    });
    $('body').on("click", 'a.memberdialog', function (e) {
        e.preventDefault();
        var title;
        var d = $('#memberDialog');
        $('iframe', d).attr("src", this.href);
        d.dialog("option", "title", this.title || 'Edit Member Dialog');
        d.dialog("open");
    });

    $("#inactive-link").click(function () {
        $.showTable($('#Inactive-tab form'));
    });
    $("#pending-link").click(function () {
        $.showTable($('#Pending-tab form'));
    });
    $("#priors-link").click(function () {
        $.showTable($('#Priors-tab form'));
    });
    $("#visitors-link").click(function () {
        $.showTable($('#Visitors-tab form'));
    });
    $("#meetings-link").click(function () {
        $.showTable($('#Meetings-tab form'));
    });
    $.maxZIndex = $.fn.maxZIndex = function (opt) {
        var def = { inc: 10, group: "*" };
        $.extend(def, opt);
        var zmax = 0;
        $(def.group).each(function () {
            var cur = parseInt($(this).css('z-index'));
            zmax = cur > zmax ? cur : zmax;
        });
        if (!this.jquery)
            return zmax;

        return this.each(function () {
            zmax += def.inc;
            $(this).css("z-index", zmax);
        });
    };

    $.initDatePicker = function (f) {
        $("ul.edit .datepicker", f).datepicker({
            //beforeShow: function () { $('#ui-datepicker-div').maxZIndex(); }
        });
        $("ul.edit .timepicker", f).timepicker({
            stepHour: 1,
            stepMinute: 5,
            timeOnly: true,
            timeFormat: "hh:mm tt",
            controlType: "slider"
        });
        $("ul.edit .datetimepicker", f).datetimepicker({
            stepHour: 1,
            stepMinute: 15,
            timeOnly: false,
            timeFormat: "hh:mm tt",
            controlType: "slider"
        });
    };
    $.showHideRegTypes = function (f) {
        $("#Settings-tab").tabs('option', 'disabled', []);
        $("#QuestionList li").show();
        $(".yes6").hide();
        switch ($("#org_RegistrationTypeId").val()) {
            case "0":
                $("#Settings-tab").tabs('option', 'disabled', [3, 4, 5]);
                break;
            case "6":
                $("#QuestionList > li").hide();
                $(".yes6").show();
                break;
        }
    };
    $("body").on("change", '#org_RegistrationTypeId', $.showHideRegTypes);
    $.showHideRegTypes();
    $("body").on('click', 'a.displayedit,a.displayedit2', function (ev) {
        ev.preventDefault();
        var f = $(this).closest('form');
        $.post($(this).attr('href'), null, function (ret) {
            $(f).html(ret).ready(function () {
                $.initDatePicker(f);
                $(".submitbutton,.bt", f).button();
                $(".roundbox select", f).css("width", "100%");
                $("#schedules", f).sortable({ stop: $.renumberListItems });
                $("#editor", f);
                $.regsettingeditclick(f);
                $.showHideRegTypes();
                $.updateQuestionList();
                $("#selectquestions").dialog({
                    title: "Add Question",
                    autoOpen: false,
                    width: 585,
                    height: 190,
                    modal: true
                });
                $('a.AddQuestion').click(function (ev) {
                    var d = $('#selectquestions');
                    d.dialog("open");
                    ev.preventDefault();
                    return false;
                });
                $(".helptip").tooltip({ showBody: "|" });
            });
        });
        return false;
    });
    $('body').on("click", "#selectquestions a", function (ev) {
        ev.preventDefault();
        $.post('/Organization/NewAsk/', { id: 'AskItems', type: $(this).attr("type") }, function (ret) {
            $('#selectquestions').dialog("close");
            $('html, body').animate({ scrollTop: $("body").height() }, 800);
            var newli = $("#QuestionList").append(ret);
            $("#QuestionList > li:last").effect("highlight", { }, 3000);
            $(".tip", newli).tooltip({ opacity: 0, showBody: "|" });
            $.updateQuestionList();
        });
        return false;
    });
    $("body").on("click", 'ul.enablesort a.del', function (ev) {
        ev.preventDefault();
        if (!$(this).attr("href"))
            return false;
        $(this).parent().parent().parent().remove();
        return false;
    });
    $("body").on("click", 'ul.enablesort a.delt', function (ev) {
        ev.preventDefault();
        if (!$(this).attr("href"))
            return false;
        if (confirm("are you sure?")) {
            $(this).parent().parent().remove();
            $.updateQuestionList();
        }
        return false;
    });
    $.exceptions = [
        "AskDropdown",
        "AskCheckboxes",
        "AskExtraQuestions",
        "AskHeader",
        "AskInstruction",
        "AskMenu"
    ];
    $.updateQuestionList = function() {
        $("#selectquestions li").each(function () {
            var type = this.className;
            var text = $(this).text();
            if (!text)
                text = type;
            if ($.inArray(type, $.exceptions) >= 0 || $("li.type-" + type).length == 0)
                $(this).html("<a href='#' type='" + type + "'>" + text + "</a>");
            else
                $(this).html("<span>" + text + "</span>");
        });
    };
    $(".helptip").tooltip({ showBody: "|", blocked: true });
    $("body").on('click', 'form.DisplayEdit a.submitbutton', function (ev) {
        ev.preventDefault();
        var f = $(this).closest('form');
        if (!$(f).valid())
            return false;
        var q = f.serialize();
        $.post($(this).attr('href'), q, function (ret) {
            if (ret.startsWith("error:")) {
                $("div.formerror", f).html(ret.substring(6));
            } else {
                $(f).html(ret).ready(function() {
                    $(".submitbutton,.bt").button();
                    $.regsettingeditclick(f);
                    $.showHideRegTypes();
                });
            }
        });
        return false;
    });
    $("body").on('click', '#future', function () {
        var f = $(this).closest('form');
        var q = f.serialize();
        $.post($(f).attr("action"), q, function (ret) {
            $(f).html(ret);
            $(".bt", f).button();
        });
    });
    $("form.DisplayEdit").submit(function () {
        if (!$("#submitit").val())
            return false;
        return true;
    });
    $('body').on("click", 'a.taguntag', function (ev) {
        ev.preventDefault();
        $.post('/Organization/ToggleTag/' + $(this).attr('pid'), null, function (ret) {
            $(ev.target).text(ret);
        });
        return false;
    });
    $.validator.addMethod("time", function (value, element) {
        return this.optional(element) || /^\d{1,2}:\d{2}\s(?:AM|am|PM|pm)/.test(value);
    }, "time format h:mm AM/PM");
    $.validator.setDefaults({
        highlight: function (input) {
            $(input).addClass("ui-state-highlight");
        },
        unhighlight: function (input) {
            $(input).removeClass("ui-state-highlight");
        }
    });
    $("#orginfoform").validate({
        rules: {
            "org.OrganizationName": { required: true, maxlength: 100 }
        }
    });
    // validate signup form on keyup and submit
    $("#settingsForm").validate({
        rules: {
            "org.SchedTime": { time: true },
            "org.OnLineCatalogSort": { digits: true },
            "org.Limit": { digits: true },
            "org.NumCheckInLabels": { digits: true },
            "org.NumWorkerCheckInLabels": { digits: true },
            "org.FirstMeetingDate": { date: true },
            "org.LastMeetingDate": { date: true },
            "org.RollSheetVisitorWks": { digits: true },
            "org.GradeAgeStart": { digits: true },
            "org.GradeAgeEnd": { digits: true },
            "org.Fee": { number: true },
            "org.Deposit": { number: true },
            "org.ExtraFee": { number: true },
            "org.ShirtFee": { number: true },
            "org.ExtraOptionsLabel": { maxlength: 50 },
            "org.OptionsLabel": { maxlength: 50 },
            "org.NumItemsLabel": { maxlength: 50 },
            "org.GroupToJoin": { digits: true },
            "org.RequestLabel": { maxlength: 50 },
            "org.DonationFundId": { number: true }
        }
    });

    $.getTable = function (f) {
        var q = q || f.serialize();
        var ff = $("#FilterGroups form");
        q = q + '&' + ff.serialize();
        $.post(f.attr('action'), q, function (ret) {
            $(f).html(ret).ready(function () {
                $('table.grid > tbody > tr:even', f).addClass('alt');
                $("a.trigger-dropdown", f).dropdown();
                $('.bt').button();
                $(".datepicker").datepicker();
            });
        });
        return false;
    };
    $("body").on("click", 'a.filtergroupslink', function (ev) {
        ev.preventDefault();
        var f = $(this).closest("form");
        $("#FilterGroups").dialog({
            title: "Filter by Name, Small Groups",
            width: "300px",
            buttons: [{
                    "text": 'Cancel',
                    "class": 'bt',
                    "click": function() {
                        $("#FilterGroups").dialog("close");
                    }
                }, {
                    "text": 'Clear',
                    "class": 'bt green',
                    "click": function() {
                        $("#namefilter").val('');
                        $("#sgprefix").val('');
                        $("#smallgrouplist").val(null);
                        $.getTable(f);
                        $("#FilterGroups").dialog("close");
                    }
                }, {
                    "text": 'Ok',
                    "class": 'blue bt',
                    "click": function() {
                        $.getTable(f);
                        $("#FilterGroups").dialog("close");
                    }
                }
            ]
        });
        return false;
    });
    $("#namefilter").keypress(function (e) {
        if ((e.keyCode || e.which) == 13) {
            e.preventDefault();
            var d = $("#FilterGroups").dialog();
            buttons = d.dialog('option', 'buttons');
            buttons[2].click();
        }
		return true;
	});
    $("body").on("click", '#addsch', function (ev) {
        ev.preventDefault();
        var f = $(this).closest('form');
        $.post("/Organization/NewSchedule", null, function (ret) {
            $("#schedules", f).append(ret).ready(function () {
                $.renumberListItems();
                $.initDatePicker(f);
            });
        });
    });
    $("body").on("click", 'a.deleteschedule', function (ev) {
        ev.preventDefault();
        $(this).parent().remove();
        $.renumberListItems();
    });
    $.renumberListItems = function () {
        var i = 1;
        $(".renumberMe").each(function () {
            $(this).val(i);
            i++;
        });
    };
    $("#NewMeetingDialog").dialog({
        autoOpen: false,
        width: 488,
        height: 450,
        modal: true
    });
    $('body').on("click", '#RollsheetLink', function (ev) {
        ev.preventDefault();
        $('#grouplabel').text("By Group");
        var d = $("#NewMeetingDialog");
        d.dialog("option", "buttons", {
            "Ok": function () {
                var dt = $.GetMeetingDateTime();
                if (!dt.valid)
                    return false;
                var args = "?org=curr&dt=" + dt.date + " " + dt.time;
                if ($('#altnames').is(":checked"))
                    args += "&altnames=true";
                if ($('#group').is(":checked"))
                    args += "&bygroup=1&sgprefix=";
                window.open("/Reports/Rollsheet/" + args);
                $(this).dialog("close");
            }
        });
        d.dialog('open');
    });
    $('body').on("click", '#RallyRollsheetLink', function (ev) {
        ev.preventDefault();
        $('#grouplabel').text("By Group");
        var d = $("#NewMeetingDialog");
        d.dialog("option", "buttons", {
            "Ok": function () {
                var dt = $.GetMeetingDateTime();
                if (!dt.valid)
                    return false;
                var args = "?org=curr&dt=" + dt.date + " " + dt.time;
                if ($('#altnames').is(":checked"))
                    args += "&altnames=true";
                if ($('#group').is(":checked"))
                    args += "&bygroup=1&sgprefix=";
                window.open("/Reports/RallyRollsheet/" + args);
                $(this).dialog("close");
            }
        });
        d.dialog('open');
    });
    $('body').on("click", '#NewMeeting', function (ev) {
        ev.preventDefault();
        $('#grouplabel').text("Group Meeting");
        var d = $("#NewMeetingDialog");
        d.dialog("option", "buttons", {
            "Ok": function () {
                var dt = $.GetMeetingDateTime();
                if (!dt.valid)
                    return false;
                var url = "?d=" + dt.date + "&t=" + dt.time +
                "&group=" + ($('#group').is(":checked") ? "true" : "false");
                $.post("/Organization/NewMeeting", { d: dt.date, t: dt.time, AttendCredit: $("#AttendCreditList").val(), group: $('#group').is(":checked") }, function (ret) {
                    if (!ret.startsWith("error"))
                        window.location = ret;
                });
                $(this).dialog("close");
            }
        });
        d.dialog('open');
        return false;
    });
    $("#ScheduleList").change(function () {
        var a = $(this).val().split(",");
        $("#NewMeetingDate").val(a[0]);
        $("#NewMeetingTime").val(a[1]);
        $("#AttendCreditList").val(a[2]);
    });
    $.GetMeetingDateTime = function () {
        var reTime = /^ *(\d{1,2}):[0-5][0-9] *((a|p|A|P)(m|M)){0,1} *$/;
        var d = $('#NewMeetingDate').val();
        var t = $('#NewMeetingTime').val();
        var v = true;
        if (!reTime.test(t)) {
            $.growlUI("error", "enter valid time");
            v = false;
        }
        if (!$.DateValid(d)) {
            $.growlUI("error", "enter valid date");
            v = false;
        }
        return { date: d, time: t, valid: v };
    };
    $('body').on('click', 'a.joinlink', function (ev) {
        ev.preventDefault();
        $.post("/Organization/Join/", { id: this.id },
            function (ret) {
                if (ret == "ok")
                    RebindMemberGrids();
                else
                    alert(ret);
            });
        return false;
    });
    $('#divisionsDialog').dialog({
        title: 'Select Divisions Dialog',
        bgiframe: true,
        autoOpen: false,
        width: 690,
        height: 650,
        modal: true,
        overlay: {
            opacity: 0.5,
            background: "black"
        }, close: function () {
            $('iframe', this).attr("src", "");
            var f = $("#orginfoform");
            $.post("/Organization/OrgInfo/" + $("#OrganizationId").val(), null, function (ret) {
                $(f).html(ret).ready(function () {
                    $(".submitbutton,.bt").button();
                });
            });
        }
    });
    $('body').on("click", '#divisionlist', function (e) {
        e.preventDefault();
        var d = $('#divisionsDialog');
        $('iframe', d).attr("src", this.href);
        d.dialog("open");
    });
    $('#orgsDialog').dialog({
        title: 'Select Orgs Dialog',
        bgiframe: true,
        autoOpen: false,
        width: 690,
        height: 650,
        modal: true,
        overlay: {
            opacity: 0.5,
            background: "black"
        }, close: function () {
            $('iframe', this).attr("src", "");
        }
    });
    $('body').on("click", '#orgpicklist', function (e) {
        e.preventDefault();
        var d = $('#orgsDialog');
        $('iframe', d).attr("src", this.href);
        d.dialog("open");
    });

    $.extraEditable = function () {
        $('.editarea').editable('/Organization/EditExtra/', {
            type: 'textarea',
            submit: 'OK',
            rows: 5,
            width: 200,
            indicator: '<img src="/images/loading.gif">',
            tooltip: 'Click to edit...'
        });
        $(".editline").editable("/Organization/EditExtra/", {
            indicator: "<img src='/images/loading.gif'>",
            tooltip: "Click to edit...",
            style: 'display: inline',
            width: 200,
            height: 25,
            submit: 'OK'
        });
    };
    $.extraEditable();
    $("#newvalueform").dialog({
        autoOpen: false,
        buttons: {
            "Ok": function () {
                var ck = $("#multiline").is(':checked');
                var fn = $("#fieldname").val();
                var v = $("#fieldvalue").val();
                if (fn)
                    $.post("/Organization/NewExtraValue/" + $("#OrganizationId").val(), { field: fn, value: v, multiline: ck }, function (ret) {
                        if (ret.startsWith("error"))
                            alert(ret);
                        else {
                            $("#extras > tbody").html(ret);
                            $.extraEditable();
                        }
                        $("#fieldname").val("");
                    });
                $(this).dialog("close");
            }
        }
    });
    $("body").on("click", '#newextravalue', function (ev) {
        ev.preventDefault();
        var d = $('#newvalueform');
        d.dialog("open");
    });
    $("#TryRegDialog").dialog({
        autoOpen: false,
        width: 500
    });
    $("body").on("click", '#tryreg', function (ev) {
        ev.preventDefault();
        var d = $('#TryRegDialog');
        d.dialog("open");
    });
    $("body").on("click", 'a.deleteextra', function (ev) {
        ev.preventDefault();
        if (confirm("are you sure?"))
            $.post("/Organization/DeleteExtra/" + $("#OrganizationId").val(), { field: $(this).attr("field") }, function (ret) {
                if (ret.startsWith("error"))
                    alert(ret);
                else {
                    $("#extras > tbody").html(ret);
                    $.extraEditable();
                }
            });
        return false;
    });
});
function RebindMemberGrids(from) {
    $.updateTable($('#Members-tab form'));
    $.updateTable($('#Inactive-tab form'));
    $.updateTable($('#Pending-tab form'));
    $.updateTable($('#Priors-tab form'));
    $.updateTable($('#Visitors-tab form'));
    $("#memberDialog").dialog("close");
}
function CloseAddDialog(from) {
    $("#memberDialog").dialog("close");
}
function UpdateSelectedUsers(topid) {
}
function UpdateSelectedOrgs(list) {
    $.post("/Organization/UpdateOrgIds", { id: $("#OrganizationId").val(), list: list }, function (ret) {
        $("#orgpickdiv").html(ret);
        $("#orgsDialog").dialog("close");
    });
}