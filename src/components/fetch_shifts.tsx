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
        return end_time > now;
    });
    shifts.sort((a: Shift, b: Shift) => {
        const endTimeA = new Date(`${a.date}T${a.end_time}`);
        const endTimeB = new Date(`${b.date}T${b.end_time}`);
        return endTimeA.getTime() - endTimeB.getTime();
    });

    return shifts;
}
