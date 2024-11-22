import { Shift } from "@/src/types/shift";

const ApiUrl: string = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/shift/";

// 引数としてidを受け取り、そのstudent_idに対応するシフト情報の配列を返す
export async function fetchShifts(id: string): Promise<Shift[]> {
    const response = await fetch(ApiUrl + id);
    // responseが404の場合はエラーを投げる
    if (!response.ok) {
        throw new Error("404 Not Found");
    }
    const data = await response.json();
    // data.end_timeが現在時刻より後のものだけを返す
    const now = new Date();

    const shifts = data.filter((shift: Shift) => {
        // end_timeは "09:00:00"のような文字列なので、Dateオブジェクトに変換する
        const end_time = new Date(`${shift.date}T${shift.end_time}`);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        return end_time > now && end_time < endOfDay;
    }).sort((a: Shift, b: Shift) => {
        const endTimeA = new Date(`${a.date}T${a.end_time}`);
        const endTimeB = new Date(`${b.date}T${b.end_time}`);
        return endTimeA.getTime() - endTimeB.getTime();
    });

    // 連続したシフトを統合する
    const mergedShifts: Shift[] = [];
    let i = 0;

    while (i < shifts.length) {
        let currentShift = shifts[i];
        let j = i + 1;

        // 連続するシフトを統合する
        while (j < shifts.length && currentShift.end_time === shifts[j].start_time && currentShift.name === shifts[j].name && currentShift.date === shifts[j].date) {
            currentShift = {
                ...currentShift,
                end_time: shifts[j].end_time
            };
            j++;
        }

        mergedShifts.push(currentShift);
        i = j; // 次のシフトに進む
    }

    return mergedShifts;
}
