import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import { TRoom } from "@/types";

const slots = [
    { id: 1, label: "Slot 1", start_time: "09:00", end_time: "10:30" },
    { id: 2, label: "Slot 2", start_time: "10:40", end_time: "12:10" },
    { id: 3, label: "Slot 3", start_time: "12:20", end_time: "13:50" },
    { id: 4, label: "Slot 4", start_time: "14:00", end_time: "15:30" },
    { id: 5, label: "Slot 5", start_time: "15:40", end_time: "17:10" },
    { id: 6, label: "Slot 6", start_time: "17:20", end_time: "18:50" },
];

const CreateBooking = ({
    rooms,
    bookedSlots,
}: {
    rooms: TRoom[];
    bookedSlots: {
        room_id: number;
        date: string;
        start_time: string;
        end_time: string;
    }[];
}) => {
    const { data, setData, post, errors, processing } = useForm({
        room_id: "",
        date: "",
        start_time: "",
        end_time: "",
        slots: [], // Add slots to the form data
    });

    // Explicitly define the type of selectedSlots as number[] (array of numbers)
    const [selectedRoom, setSelectedRoom] = useState<TRoom | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedSlots, setSelectedSlots] = useState<number[]>([]); // <-- Explicit type definition here
    const [disabledSlots, setDisabledSlots] = useState<Set<number>>(new Set()); // Store disabled slots

    useEffect(() => {
        if (selectedRoom && selectedDate) {
            // Filter booked slots for the selected room and date
            const bookedForRoomAndDate = bookedSlots.filter(
                (booking) =>
                    booking.room_id === selectedRoom.id &&
                    booking.date === selectedDate
            );
            // console.log(bookedForRoomAndDate); // Debugging the booked slots for the selected room and date

            // Disable slots that are already booked
            const bookedSlotIds = new Set(
                bookedForRoomAndDate.flatMap((booking) => {
                    // For each booking, map over its slots and find the corresponding slot ids
                    return booking.slots.map((slotId) => {
                        return slotId; // Directly using the slot ID
                    });
                })
            );

            setDisabledSlots(bookedSlotIds); // Update the state with the booked slot IDs
            // console.log(bookedSlotIds); // Debugging the Set of disabled slots
        }
    }, [selectedRoom, selectedDate, bookedSlots]);


    const handleRoomChange = (roomId: string) => {
        const room = rooms.find((room) => room.id.toString() === roomId);
        setSelectedRoom(room || null);
        setData("room_id", roomId);
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setData("date", date);
    };

    const handleSlotChange = (slotId: number) => {
        const updatedSlots = selectedSlots.includes(slotId)
            ? selectedSlots.filter((id) => id !== slotId)
            : [...selectedSlots, slotId].sort((a, b) => a - b);

        setSelectedSlots(updatedSlots);

        if (updatedSlots.length > 0) {
            const startTime = slots[updatedSlots[0] - 1]?.start_time || "";
            const endTime =
                slots[updatedSlots[updatedSlots.length - 1] - 1]?.end_time ||
                "";
            setData("start_time", startTime);
            setData("end_time", endTime);
            setData("slots", updatedSlots); // Update slots in the form data
        } else {
            setData("start_time", "");
            setData("end_time", "");
            setData("slots", []);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.start_time || !data.end_time || selectedSlots.length === 0) {
            alert("Please select at least one valid slot.");
            return;
        }

        // Add selected slots to form data before submitting
        setData("slots", selectedSlots); // Ensure slots are included

        // Submit the form with all the data (room_id, date, start_time, end_time, slots)
        post(route("booking.store"));
    };

    return (
        <AuthLayout>
            <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-md">
                <h1 className="text-3xl font-semibold mb-8">Create Booking</h1>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Select Room</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={data.room_id}
                            onChange={(e) => handleRoomChange(e.target.value)}
                        >
                            <option value="">-- Select a Room --</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.name}
                                </option>
                            ))}
                        </select>
                        {errors.room_id && (
                            <p className="text-sm text-red-500 mt-1">
                                * {errors.room_id}
                            </p>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Select Date</span>
                        </label>
                        <input
                            type="date"
                            className="input input-bordered w-full"
                            value={data.date}
                            onChange={(e) => handleDateChange(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                        />
                        {errors.date && (
                            <p className="text-sm text-red-500 mt-1">
                                * {errors.date}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">Select Slots</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {slots.map((slot) => (
                                <button
                                    key={slot.id}
                                    type="button"
                                    disabled={disabledSlots.has(slot.id)}
                                    onClick={() => handleSlotChange(slot.id)}
                                    className={`btn ${
                                        disabledSlots.has(slot.id)
                                            ? "btn-disabled bg-gray-300"
                                            : selectedSlots.includes(slot.id)
                                            ? "btn-primary"
                                            : "btn-outline"
                                    }`}
                                >
                                    {slot.label} ({slot.start_time} -{" "}
                                    {slot.end_time})
                                </button>
                            ))}
                        </div>
                        {errors.slots && (
                            <p className="text-sm text-red-500 mt-1">
                                * {errors.slots}
                            </p>
                        )}
                    </div>

                    <div className="form-control">
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={processing}
                        >
                            {processing ? "Processing..." : "Create Booking"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};

export default CreateBooking;
