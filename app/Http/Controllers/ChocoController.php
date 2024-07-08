<?php

namespace App\Http\Controllers;

use App\Models\Choco;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ChocoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Chocos/Index', [
            
            'chocos' => Choco::with('user:id,name')->latest()->get(),
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
        //

        Log::info('Request data:', $request->all());

        $validated = $request->validate([
            'title' => 'required|string|max:32',
            'color' => 'required|string|max:7',
            'start' => 'required|date',
            'end' => 'nullable|date',
            'allDay' => 'required|boolean',
        ]);

        Log::info('Validated data:', $validated);

        $choco = new Choco($validated);
        $choco->user_id = $request->user()->id;
        $choco->save();

        $storedChocoId = $choco->id;

        Log::info('Choco created successfully');

        return response()->json(['stored_choco_id' => $storedChocoId]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Choco $choco)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Choco $choco)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Choco $choco)
    {

        Log::info('Requested data:', ['request' => $request->all()]);

        Gate::authorize('update', $choco);

 
        $validated = $request->validate([
            'start' => 'required|date',
            'end' => 'nullable|date',
            'allDay' => 'required|boolean',

        ]);

        Log::info('Requested data:', ['validated' => $validated]);

        // UTCから日本時間にフォーマットする
        $validated['start'] = Carbon::parse($validated['start'])->setTimeZone('Asia/Tokyo');
        if (isset($validated['end'])) {
            $validated['end'] = Carbon::parse($validated['end'])->setTimeZone('Asia/Tokyo');
        }

 
        $choco->update($validated);

        Log::info('Choco update successfully');
 
        return response()->json(['success' => true]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Choco $choco)
    {

        Log::info('Deleting Choco:', ['choco' => $choco]);
        
        Gate::authorize('delete', $choco);
        
        $choco->delete();

        Log::info('Choco destroy successfully');
        
        return response()->json(['success' => true]);
    }
}
