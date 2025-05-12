import {getTimeSlotList} from '@/apis/classroom'

let timeSlot = []

export async function getTimeSlot() {
    if (timeSlot.length > 0) {
        return timeSlot
    }
    const res = await getTimeSlotList();
    timeSlot = res.data.data
    return timeSlot
}

export const padZero = (n) => {
    return n < 10 ? '0' + n : n;
}
