import { Calendar } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import axios from "axios";

axios.defaults.headers.common = {
    "X-Requested-With": "XMLHttpRequest",
    "X-CSRF-TOKEN": document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content"),
};

document.addEventListener('DOMContentLoaded', function() {

var calendarEl = document.getElementById("calendar");

let calendar = new Calendar(calendarEl, {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",

    events: "http://localhost/calendar",
    locale: "ja",
    height: "auto",
    firstDay: 1,
    headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,listMonth",
    },
    buttonText: {
        today: "今日",
        week: "週",
        month: "月",
        list: "一覧",
    },


    noEventsContent: "スケジュールはありません",

    // 日付をクリック、または範囲を選択したイベント
    selectable: true,
    select: function (selectInfo) {
        let title = prompt("イベントを入力してください");

        console.log(selectInfo);
        if (title) {
            axios
                .post("http://localhost/schedule-add", {
                    start_date: selectInfo.startStr.valueOf(),
                    end_date: selectInfo.endStr.valueOf(),
                    event_name: title,
                })
                .then(() => {
                    // イベントの追加
                    calendar.addEvent({
                        start_date: selectInfo.startStr,
                        end_date: selectInfo.endStr,
                        event_name: title,
                    });
                })
                .catch(() => {
                    console.log(error);
                });
        }
    },

});

calendar.render();
});