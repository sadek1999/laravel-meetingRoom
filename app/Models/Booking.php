<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
    protected $fillable=['name','user_id','room_id','start_date','end_date','date'];
    public function rooms()
    {

    return $this->belongsTo(Room::class) ;
    }
    public function user()
    {

    return $this->belongsTo(User::class) ;
    }
    public function host()
    {

    return $this->hasMany(Host::class) ;
    }
}
