<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
       /**
     * Display a listing of the resource.
     */

     public function index()
     {
         $data = Booking::latest()->paginate();
         return Inertia::render('Booing/index', [
             'bookings' => $data
         ]);
     }

     /**
      * Show the form for creating a new resource.
      */
     public function create()
     {
         //
     }

     /**
      * Store a newly created resource in storage.
      */
     public function store(Request $request)
     {
         $validateData = $request->validate([
             'room_id' => 'required|integer|exists:rooms,id', // Ensure room ID exists in the rooms table as a primary key
             'start_time' => 'required|date_format:H:i', // Validate start time in HH:mm format
             'end_time' => 'required|date_format:H:i|after:start_time', // End time must be after start time
             'date' => 'required|date|after_or_equal:today', // Ensure date is today or in the future

         ]);
         $validateData['user_id'] = Auth::user()->id;

         Booking::create($validateData);

         return back();
     }

     /**
      * Display the specified resource.
      */
     public function show(Booking $booking)
     {
         return Inertia::render('Booking/show', [
             'booking' => $booking
         ]);
     }

     /**
      * Show the form for editing the specified resource.
      */
     public function edit(Booking $booking)
     {
         return Inertia::render('Booking/edit', [
             'booking' => $booking
         ]);
     }

     /**
      * Update the specified resource in storage.
      */
     public function update(Request $request, Booking $booking)
     {
         if ($booking->user_id !== Auth::user()->id) {
             return redirect()->back()->withErrors(['error' => 'you are not authorized for update this bookings']);
         };
         $validateData = $request->validate([
             'room_id' => 'integer|exists:rooms,id',
             'start_time' => 'date_format:H:i',
             'end_time' => 'date_format:H:i|after:start_time',
             'date' => 'date|after_or_equal:today',
         ]);
         $booking->update($validateData);
         return redirect()->route('index')->with('success', 'successfully update the booking');
     }

     /**
      * Remove the specified resource from storage.
      */
     public function destroy(Booking $booking)
     {
         $authUser = Auth::user();
         if ($authUser->hasRole('admin') || $booking->user_id == $authUser->id && $booking->delete()) {
             return redirect()->route('bookings.index')->with('success', 'Booking deleted successfully!');
         }
     }
}
