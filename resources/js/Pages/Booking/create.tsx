import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

interface BookingFormData {
    room_id: string;
    date: string;
    start_time: string;
    end_time: string;
}

const CreateBooking = () => {
    const { data, setData, post, errors } = useForm<BookingFormData>({
        room_id: '',
        date: '',
        start_time: '',
        end_time: '',
    });

    const slots = [
        { start_time: '09:00', end_time: '10:30' },
        { start_time: '10:40', end_time: '12:10' },
        { start_time: '12:20', end_time: '13:50' },
        { start_time: '14:00', end_time: '15:30' },
        { start_time: '15:40', end_time: '17:10' },
        { start_time: '17:20', end_time: '18:50' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.start_time || !data.end_time) {
            alert('Please select a time slot.');
            return;
        }

        post(route('booking.store'));
    };

    return (
        <AuthLayout>
            <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow rounded">
                <h1 className="text-2xl font-bold mb-6">Create Booking</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Room ID */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Room ID</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter room ID"
                            className="input input-bordered w-full"
                            value={data.room_id}
                            onChange={(e) => setData('room_id', e.target.value)}
                        />
                        {errors.room_id && <p className="text-red-500 text-sm">{errors.room_id}</p>}
                    </div>

                    {/* Date */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Date</span>
                        </label>
                        <input
                            type="date"
                            className="input input-bordered w-full"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                        />
                        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                    </div>

                    {/* Time Slots */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Time Slots</span>
                        </label>
                        <div className="space-y-2">
                            {slots.map((slot, index) => (
                                <label key={index} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="slot"
                                        className="radio radio-primary"
                                        checked={
                                            data.start_time === slot.start_time &&
                                            data.end_time === slot.end_time
                                        }
                                        onChange={() =>
                                            setData({
                                                ...data,
                                                start_time: slot.start_time,
                                                end_time: slot.end_time,
                                            })
                                        }
                                    />
                                    <span>
                                        {slot.start_time} - {slot.end_time}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {(errors.start_time || errors.end_time) && (
                            <p className="text-red-500 text-sm">
                                {errors.start_time || errors.end_time}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="form-control w-full">
                        <button type="submit" className="btn btn-primary w-full">
                            Create Booking
                        </button>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};

export default CreateBooking;

