
## Overview
Restructured the booking state management to support both onward and return journeys in a unified state model, and conditionally hid promo code and pricing sections in the return journey panel.

## Changes Made

### 1. BookingReducer.tsx
**New State Structure:**
```typescript
export interface JourneyDetails {
  serviceType: string;
  date: Date | undefined;
  time: string | null;
  pickupLocation: string;
  stops: string[];
  dropoffLocation: string;
  passengers: number;
  luggage: number;
  vehicle?: string;
}

export interface BookingState {
  onward: JourneyDetails;
  returnEnabled: boolean;
  returnJourney?: JourneyDetails;
  user: { ... } | null;
  payment: { ... } | null;
  currentStep: number;
  completedSteps: number[];
  expandedSteps: number[];
  summarySteps: number[];
  remarks: string;
}
```

**New Actions:**
- `UPDATE_ONWARD_DETAILS`: Updates onward journey details
- `UPDATE_RETURN_DETAILS`: Updates return journey details
- `ENABLE_RETURN_JOURNEY`: Toggles return journey enabled state
- `INITIALIZE_RETURN_JOURNEY`: Creates return journey with reversed locations from onward journey
- `UPDATE_BOOKING_DETAILS`: Kept for backward compatibility (updates onward journey)

**Key Changes:**
- Moved from flat `bookingDetails` to structured `onward` and optional `returnJourney`
- Vehicle property moved from state root to inside `JourneyDetails`
- `SET_VEHICLE` now updates `state.onward.vehicle`
- `INITIALIZE_RETURN_JOURNEY` swaps pickup/dropoff and copies other details

### 2. AddDetails.tsx
**Updated References:**
- Changed `state.bookingDetails` to `state.onward`
- Dispatch action changes from `UPDATE_BOOKING_DETAILS` to:
  - `UPDATE_ONWARD_DETAILS` when in main context
  - `UPDATE_RETURN_DETAILS` when in return context
- All local state initialization now uses `onward.*` properties

### 3. Checkout.tsx
**State References Updated:**
- Changed `state.bookingDetails.*` to `state.onward.*` in ReturnJourneyPanel props

**UI Changes - Conditional Rendering:**
```typescript
{!returnContext && (
  <>
    {/* Promo Code Section */}
    <div className="bg-gray-100 mt-4 px-6 py-1 border-b border-gray-200">
      <h2 className="text-lg font-medium text-gray-800">Promo Code</h2>
    </div>
    {/* ... promo code form ... */}
    
    {/* Pricing Section */}
    <div className="bg-gray-100 mt-4 px-6 py-1 border-b border-gray-200">
      <h2 className="text-lg font-medium text-gray-800">Pricing</h2>
    </div>
    {/* ... pricing details ... */}
  </>
)}
```

**Result:** Promo Code and Pricing sections are now hidden when in return journey context.

### 4. ReturnJourneyPanel.tsx
**Initial State Updated:**
```typescript
const returnInitialState: BookingState = {
  onward: {
    serviceType: 'point-to-point',
    pickupLocation: outboundBooking.dropoffLocation,  // Reversed
    dropoffLocation: outboundBooking.pickupLocation,  // Reversed
    // ... other properties
  },
  returnEnabled: false,
  returnJourney: undefined,
  // ... rest of state
};
```

**Key Changes:**
- Removed `vehicle` from state root (now in `onward.vehicle`)
- Updated to new state structure with `onward` and `returnJourney`

### 5. ReturnAddDetailsWrapper.tsx
**Initial State Updated:**
- Same structural changes as ReturnJourneyPanel
- Changed from `bookingDetails` to `onward` structure
- Removed `vehicle` from state root

## Migration Guide

### For Components Using Booking State:

**Old Way:**
```typescript
const { serviceType, date, pickupLocation } = state.bookingDetails;
```

**New Way:**
```typescript
const { serviceType, date, pickupLocation } = state.onward;
```

### For Dispatching Updates:

**Old Way:**
```typescript
dispatch({ 
  type: "UPDATE_BOOKING_DETAILS", 
  payload: { pickupLocation: "New Location" } 
});
```

**New Way:**
```typescript
// For onward journey
dispatch({ 
  type: "UPDATE_ONWARD_DETAILS", 
  payload: { pickupLocation: "New Location" } 
});

// For return journey
dispatch({ 
  type: "UPDATE_RETURN_DETAILS", 
  payload: { pickupLocation: "New Location" } 
});
```

### Enabling Return Journey:

```typescript
// Enable return journey
dispatch({ type: "ENABLE_RETURN_JOURNEY", payload: true });

// Initialize return journey with reversed locations
dispatch({ type: "INITIALIZE_RETURN_JOURNEY" });

// Access return journey data
if (state.returnJourney) {
  console.log(state.returnJourney.pickupLocation);
}
```

## Benefits

1. **Unified State Management**: Both onward and return journeys live in the same state tree
2. **Type Safety**: Reuse `JourneyDetails` interface for both journeys
3. **Clean Separation**: Clear distinction between onward and return journey data
4. **Context Switching**: Components automatically adapt UI based on which journey they're managing
5. **Backward Compatibility**: `UPDATE_BOOKING_DETAILS` still works for legacy code
6. **Conditional UI**: Return journey hides unnecessary sections (promo, pricing)

## Testing Checklist

- [ ] Onward journey form submission saves to `state.onward`
- [ ] Return journey panel opens with reversed locations
- [ ] Return journey form submission saves correctly
- [ ] Promo code section hidden in return journey
- [ ] Pricing section hidden in return journey
- [ ] Passenger management works in both contexts
- [ ] Step navigation works correctly
- [ ] State persists across component re-renders
- [ ] Vehicle selection updates `state.onward.vehicle`

## Next Steps

1. **Test the complete flow**: Onward journey → Enable return → Fill return journey
2. **Update any remaining components**: Search codebase for `state.bookingDetails` references
3. **API Integration**: Update API calls to send both `onward` and `returnJourney` data
4. **Final Details Step**: Update FinalDetails component to display both journeys
5. **Payment Flow**: Ensure payment calculates pricing for both journeys if applicable
