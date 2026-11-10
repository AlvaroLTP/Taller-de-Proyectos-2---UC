-- Prepared locally on 2026-11-10. Do not apply remotely without a separate approval.
BEGIN;

ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS energy_kwh_per_km numeric,
  ADD COLUMN IF NOT EXISTS emission_factor_source text;

ALTER TABLE public.parameters
  ADD COLUMN IF NOT EXISTS depot_lat numeric,
  ADD COLUMN IF NOT EXISTS depot_lng numeric,
  ADD COLUMN IF NOT EXISTS electricity_emission_factor_kg_co2e_per_kwh numeric;

ALTER TABLE public.routes
  ADD COLUMN IF NOT EXISTS outbound_distance_km numeric,
  ADD COLUMN IF NOT EXISTS return_distance_km numeric,
  ADD COLUMN IF NOT EXISTS payload_tonne_km numeric,
  ADD COLUMN IF NOT EXISTS energy_kwh numeric,
  ADD COLUMN IF NOT EXISTS emissions_method text,
  ADD COLUMN IF NOT EXISTS emissions_source text;

ALTER TABLE public.vehicles
  ADD CONSTRAINT vehicle_energy_nonnegative CHECK (energy_kwh_per_km IS NULL OR energy_kwh_per_km >= 0) NOT VALID;
ALTER TABLE public.parameters
  ADD CONSTRAINT parameter_depot_coordinates CHECK ((depot_lat IS NULL AND depot_lng IS NULL) OR (depot_lat BETWEEN -90 AND 90 AND depot_lng BETWEEN -180 AND 180)) NOT VALID;
ALTER TABLE public.parameters
  ADD CONSTRAINT parameter_electricity_factor_nonnegative CHECK (electricity_emission_factor_kg_co2e_per_kwh IS NULL OR electricity_emission_factor_kg_co2e_per_kwh >= 0) NOT VALID;
ALTER TABLE public.routes
  ADD CONSTRAINT route_traceability_metrics_nonnegative CHECK (
    (outbound_distance_km IS NULL OR outbound_distance_km >= 0)
    AND (return_distance_km IS NULL OR return_distance_km >= 0)
    AND (payload_tonne_km IS NULL OR payload_tonne_km >= 0)
    AND (energy_kwh IS NULL OR energy_kwh >= 0)
  ) NOT VALID;

COMMIT;
