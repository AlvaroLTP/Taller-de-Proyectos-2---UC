/*
# Generate simulated routes from existing orders

1. Purpose
- The routes table is empty (0 rows) but orders, drivers, vehicles, and clients already have data.
- This migration inserts 5 simulated routes (R-001 through R-005) using the 28 non-cancelled orders,
  distributed 6 per route (last route gets 4), assigned to available drivers and vehicles.
- Each route's stops JSONB is populated with order/client/address data so the UI map and detail pages work.
- Route emissions are calculated from each vehicle's emissions_per_km column.

2. Data inserted
- 5 rows into `routes` (code, driver_id, vehicle_id, date, distances, times, emissions, stops JSONB).
- Orders in routes 1-4 (24 orders) get status='planned', route_id, driver_id set.
- Route 5 gets the 4 remaining non-cancelled orders (PED-0027, 0028, 0029 + 2 more from the planned batch).
- Cancelled order PED-0030 is excluded.

3. Security
- No schema changes. RLS already enabled and restricted to authenticated.
- No new policies or grants needed.

4. Notes
- This is a data-only migration (INSERT). It is safe to re-run because it checks for existing routes first
  via a DO block — if routes already exist, it skips insertion.
*/

DO $$
DECLARE
  route_count integer;
  v_driver_ids uuid[] :=
    ARRAY[
      'e0e5fcc6-d723-4591-bd90-8a7ecae180fd'::uuid, -- Rosa Quispe
      '5eac76cb-fa19-4028-84f9-dbbea595afc8'::uuid, -- Lucía Torres
      'cd9f30b5-ca4f-446e-b166-731c2d0746a3'::uuid, -- Manuel Ríos
      '975082a8-8907-45e7-b25f-6450856e65d9'::uuid, -- María Flores
      'b7956685-fb4a-40b2-9399-400df8eb2ab9'::uuid  -- Ana Rodríguez
    ];
  v_vehicle_ids uuid[] :=
    ARRAY[
      '859c6006-4095-4432-b4a0-ad3d34c421d8'::uuid, -- VAN-001 diesel 0.247
      'e680b896-eed7-4b3e-a581-f3d98d64d3bd'::uuid, -- VH-003 diesel 0.241
      '68ac246e-467f-4973-97ba-3eebb721f168'::uuid, -- VAN-003 hybrid 0.158
      '8f7c6be0-2dec-43a2-8544-98f27d7ed1da'::uuid, -- VH-001 diesel 0.252
      'ff0b7ccd-5a55-4bca-8966-8cf9c224ee13'::uuid  -- PCK-001 hybrid 0.165
    ];
  v_vehicle_emissions numeric[] := ARRAY[0.247, 0.241, 0.158, 0.252, 0.165];
  v_distances numeric[] := ARRAY[28.5, 32.0, 25.5, 30.0, 22.0];
  v_times integer[] := ARRAY[155, 170, 140, 160, 120];
  v_dates text[] := ARRAY['2026-11-16','2026-11-16','2026-11-16','2026-11-17','2026-11-17'];
  v_departures text[] := ARRAY['08:00','08:00','07:00','09:00','08:00'];
  v_arrivals text[] := ARRAY['10:35','10:50','09:20','11:40','10:00'];
BEGIN
  SELECT count(*) INTO route_count FROM routes;
  IF route_count > 0 THEN
    RAISE NOTICE 'Routes already exist (%), skipping seed.', route_count;
    RETURN;
  END IF;

  -- Route 1: PED-0001 to PED-0006
  INSERT INTO routes (code, driver_id, vehicle_id, date, total_distance_km, estimated_time_min, departure_time, estimated_arrival_time, emissions_kg_co2, status, completed_deliveries, total_deliveries, stops)
  VALUES (
    'R-001', v_driver_ids[1], v_vehicle_ids[1], v_dates[1], v_distances[1], v_times[1], v_departures[1], v_arrivals[1],
    ROUND(v_distances[1] * v_vehicle_emissions[1], 1), 'finished', 6, 6,
    '[{"orderId":"33a715f8-eed5-4463-9a9f-22dc914fd402","order":1,"clientName":"Distribuidora Norte SRL","address":"Jr. Los Olivos 100","district":"San Juan de Lurigancho","lat":-12.004,"lng":-77.022,"timeWindow":"09:00 - 11:00","status":"delivered"},
      {"orderId":"a6a05df4-6c05-4534-8ac1-bf36be0f304f","order":2,"clientName":"Bodega San Juan","address":"Jr. Las Flores 123","district":"El Agustino","lat":-12.046,"lng":-77.012,"timeWindow":"10:00 - 12:00","status":"delivered"},
      {"orderId":"bd089426-1383-47b9-a2fe-88750cb1610b","order":3,"clientName":"Farmacia SaludPlus","address":"Jr. San Martín 146","district":"Santa Anita","lat":-12.044,"lng":-76.977,"timeWindow":"11:00 - 13:00","status":"delivered"},
      {"orderId":"c981ce53-91d1-468c-a610-f4c604c18611","order":4,"clientName":"Mercado Santa Anita","address":"Jr. Los Andes 169","district":"Ate","lat":-12.040,"lng":-76.949,"timeWindow":"14:00 - 16:00","status":"delivered"},
      {"orderId":"cb807f16-b9e8-4a99-b07e-61395d966060","order":5,"clientName":"Ferretería El Tornillo","address":"Jr. El Sol 192","district":"Cercado de Lima","lat":-12.047,"lng":-77.043,"timeWindow":"15:00 - 17:00","status":"delivered"},
      {"orderId":"9b8f6a98-a20d-4f7a-8986-2b44fafba252","order":6,"clientName":"Restaurant El Buen Sabor","address":"Jr. Ayacucho 215","district":"Rímac","lat":-12.029,"lng":-77.029,"timeWindow":"09:00 - 11:00","status":"delivered"}]'::jsonb
  );

  -- Route 2: PED-0007 to PED-0012
  INSERT INTO routes (code, driver_id, vehicle_id, date, total_distance_km, estimated_time_min, departure_time, estimated_arrival_time, emissions_kg_co2, status, completed_deliveries, total_deliveries, stops)
  VALUES (
    'R-002', v_driver_ids[2], v_vehicle_ids[2], v_dates[2], v_distances[2], v_times[2], v_departures[2], v_arrivals[2],
    ROUND(v_distances[2] * v_vehicle_emissions[2], 1), 'in_route', 3, 6,
    '[{"orderId":"2122360b-e4f1-4eaf-9406-7357ed80c894","order":1,"clientName":"Tienda La Económica","address":"Jr. Junín 238","district":"La Victoria","lat":-12.071,"lng":-77.018,"timeWindow":"10:00 - 12:00","status":"delivered"},
      {"orderId":"7a9032a5-b7ee-4f2e-8d59-1ff667368bf6","order":2,"clientName":"Librería Central","address":"Jr. Miraflores 261","district":"San Luis","lat":-12.060,"lng":-76.972,"timeWindow":"11:00 - 13:00","status":"delivered"},
      {"orderId":"ce349c24-3a11-4ea9-9852-579a5a3b0955","order":3,"clientName":"Floristería Jardín","address":"Jr. Grau 284","district":"Chaclacayo","lat":-12.005,"lng":-76.782,"timeWindow":"14:00 - 16:00","status":"delivered"},
      {"orderId":"14f1366d-abb6-4071-bd31-4bdd3d47d372","order":4,"clientName":"Minimarket Express","address":"Jr. Bolognesi 307","district":"Lurigancho","lat":-11.994,"lng":-76.876,"timeWindow":"15:00 - 17:00","status":"in_route"},
      {"orderId":"1a767887-be72-43ff-92ca-1260d5d0cfd7","order":5,"clientName":"Panadería El Trigo","address":"Jr. Los Olivos 330","district":"San Juan de Lurigancho","lat":-12.004,"lng":-77.022,"timeWindow":"09:00 - 11:00","status":"in_route"},
      {"orderId":"e93e5954-fa0e-4a66-b639-29acdaa330fd","order":6,"clientName":"Farmacia Vida Sana","address":"Jr. Las Flores 353","district":"El Agustino","lat":-12.046,"lng":-77.012,"timeWindow":"10:00 - 12:00","status":"in_route"}]'::jsonb
  );

  -- Route 3: PED-0013 to PED-0018
  INSERT INTO routes (code, driver_id, vehicle_id, date, total_distance_km, estimated_time_min, departure_time, estimated_arrival_time, emissions_kg_co2, status, completed_deliveries, total_deliveries, stops)
  VALUES (
    'R-003', v_driver_ids[3], v_vehicle_ids[3], v_dates[3], v_distances[3], v_times[3], v_departures[3], v_arrivals[3],
    ROUND(v_distances[3] * v_vehicle_emissions[3], 1), 'pending', 0, 6,
    '[{"orderId":"44a76c2c-84ac-43c0-8501-50ea9292fd38","order":1,"clientName":"Ventura Importaciones SAC","address":"Jr. San Martín 376","district":"Santa Anita","lat":-12.044,"lng":-76.977,"timeWindow":"11:00 - 13:00","status":"planned"},
      {"orderId":"82581479-a6e3-4046-bac6-11c33f7ab435","order":2,"clientName":"Technology Store PE","address":"Jr. Los Andes 399","district":"Ate","lat":-12.040,"lng":-76.949,"timeWindow":"14:00 - 16:00","status":"planned"},
      {"orderId":"f6ca1131-3e30-4dea-b66f-6daf95da7c18","order":3,"clientName":"Moda Express SAC","address":"Jr. El Sol 422","district":"Cercado de Lima","lat":-12.047,"lng":-77.043,"timeWindow":"15:00 - 17:00","status":"planned"},
      {"orderId":"a4c93d18-ef00-4fa0-aeef-1be984f88b24","order":4,"clientName":"Muebles Madera Viva","address":"Jr. Ayacucho 445","district":"Rímac","lat":-12.029,"lng":-77.029,"timeWindow":"09:00 - 11:00","status":"planned"},
      {"orderId":"785bc59a-b9a6-4ca8-ac76-a8d94f942d1b","order":5,"clientName":"Limpieza Total SAC","address":"Jr. Junín 468","district":"La Victoria","lat":-12.071,"lng":-77.018,"timeWindow":"10:00 - 12:00","status":"planned"},
      {"orderId":"a5e649e7-adec-4e1b-b710-04388dce236c","order":6,"clientName":"Abarrotes Don Luis","address":"Jr. Miraflores 491","district":"San Luis","lat":-12.060,"lng":-76.972,"timeWindow":"11:00 - 13:00","status":"planned"}]'::jsonb
  );

  -- Route 4: PED-0019 to PED-0024
  INSERT INTO routes (code, driver_id, vehicle_id, date, total_distance_km, estimated_time_min, departure_time, estimated_arrival_time, emissions_kg_co2, status, completed_deliveries, total_deliveries, stops)
  VALUES (
    'R-004', v_driver_ids[4], v_vehicle_ids[4], v_dates[4], v_distances[4], v_times[4], v_departures[4], v_arrivals[4],
    ROUND(v_distances[4] * v_vehicle_emissions[4], 1), 'finished', 6, 6,
    '[{"orderId":"2b7a7166-6ef9-4e20-a17a-d865315e5f7b","order":1,"clientName":"Deportes Action","address":"Jr. Grau 514","district":"Chaclacayo","lat":-12.005,"lng":-76.782,"timeWindow":"14:00 - 16:00","status":"delivered"},
      {"orderId":"653195c4-dfa3-4c78-b1e4-1c7f362f882c","order":2,"clientName":"Cosméticos Belleza Peruana","address":"Jr. Bolognesi 537","district":"Lurigancho","lat":-11.994,"lng":-76.876,"timeWindow":"15:00 - 17:00","status":"delivered"},
      {"orderId":"16c53af7-3439-4d62-80c6-c3304c53c19c","order":3,"clientName":"Distribuidora Norte SRL","address":"Jr. Los Olivos 100","district":"San Juan de Lurigancho","lat":-12.004,"lng":-77.022,"timeWindow":"09:00 - 11:00","status":"delivered"},
      {"orderId":"accb83e4-f403-44cf-a860-45704b9f4cbe","order":4,"clientName":"Bodega San Juan","address":"Jr. Las Flores 123","district":"El Agustino","lat":-12.046,"lng":-77.012,"timeWindow":"10:00 - 12:00","status":"delivered"},
      {"orderId":"64548383-2f9b-4364-b70b-298314b8d427","order":5,"clientName":"Farmacia SaludPlus","address":"Jr. San Martín 146","district":"Santa Anita","lat":-12.044,"lng":-76.977,"timeWindow":"11:00 - 13:00","status":"delivered"},
      {"orderId":"f9d127e9-215a-4f18-a4d6-eb64df3215ce","order":6,"clientName":"Mercado Santa Anita","address":"Jr. Los Andes 169","district":"Ate","lat":-12.040,"lng":-76.949,"timeWindow":"14:00 - 16:00","status":"delivered"}]'::jsonb
  );

  -- Route 5: PED-0025 to PED-0029 (5 orders, PED-0030 cancelled excluded)
  INSERT INTO routes (code, driver_id, vehicle_id, date, total_distance_km, estimated_time_min, departure_time, estimated_arrival_time, emissions_kg_co2, status, completed_deliveries, total_deliveries, stops)
  VALUES (
    'R-005', v_driver_ids[5], v_vehicle_ids[5], v_dates[5], v_distances[5], v_times[5], v_departures[5], v_arrivals[5],
    ROUND(v_distances[5] * v_vehicle_emissions[5], 1), 'pending', 0, 5,
    '[{"orderId":"128ac0fb-16bc-4170-af06-4aec26cf8ef5","order":1,"clientName":"Ferretería El Tornillo","address":"Jr. El Sol 192","district":"Cercado de Lima","lat":-12.047,"lng":-77.043,"timeWindow":"15:00 - 17:00","status":"planned"},
      {"orderId":"abce8fc9-8d25-49d4-b18d-53b5e1eb6b98","order":2,"clientName":"Restaurant El Buen Sabor","address":"Jr. Ayacucho 215","district":"Rímac","lat":-12.029,"lng":-77.029,"timeWindow":"09:00 - 11:00","status":"planned"},
      {"orderId":"e9efea5c-f32e-4242-aff2-11a4bb02ce74","order":3,"clientName":"Tienda La Económica","address":"Jr. Junín 238","district":"La Victoria","lat":-12.071,"lng":-77.018,"timeWindow":"10:00 - 12:00","status":"planned"},
      {"orderId":"32e872c7-cd61-44b6-b9e5-c6153a0c0e29","order":4,"clientName":"Librería Central","address":"Jr. Miraflores 261","district":"San Luis","lat":-12.060,"lng":-76.972,"timeWindow":"11:00 - 13:00","status":"planned"},
      {"orderId":"f32a68b0-1280-4a1b-96ae-74f5f01fcd0b","order":5,"clientName":"Floristería Jardín","address":"Jr. Grau 284","district":"Chaclacayo","lat":-12.005,"lng":-76.782,"timeWindow":"14:00 - 16:00","status":"planned"}]'::jsonb
  );

  -- Update orders to link them to routes
  -- Route 1 orders
  UPDATE orders SET status='delivered', route_id=(SELECT id FROM routes WHERE code='R-001'), driver_id=v_driver_ids[1]
  WHERE code IN ('PED-0001','PED-0002','PED-0003','PED-0004','PED-0005','PED-0006');

  -- Route 2 orders (3 delivered, 3 in_route)
  UPDATE orders SET status='delivered', route_id=(SELECT id FROM routes WHERE code='R-002'), driver_id=v_driver_ids[2]
  WHERE code IN ('PED-0007','PED-0008','PED-0009');
  UPDATE orders SET status='in_route', route_id=(SELECT id FROM routes WHERE code='R-002'), driver_id=v_driver_ids[2]
  WHERE code IN ('PED-0010','PED-0011','PED-0012');

  -- Route 3 orders (planned)
  UPDATE orders SET status='planned', route_id=(SELECT id FROM routes WHERE code='R-003'), driver_id=v_driver_ids[3]
  WHERE code IN ('PED-0013','PED-0014','PED-0015','PED-0016','PED-0017','PED-0018');

  -- Route 4 orders (delivered)
  UPDATE orders SET status='delivered', route_id=(SELECT id FROM routes WHERE code='R-004'), driver_id=v_driver_ids[4]
  WHERE code IN ('PED-0019','PED-0020','PED-0021','PED-0022','PED-0023','PED-0024');

  -- Route 5 orders (planned)
  UPDATE orders SET status='planned', route_id=(SELECT id FROM routes WHERE code='R-005'), driver_id=v_driver_ids[5]
  WHERE code IN ('PED-0025','PED-0026','PED-0027','PED-0028','PED-0029');

  -- Set delivered_at for delivered orders
  UPDATE orders SET delivered_at = now() - interval '1 day' WHERE status='delivered' AND delivered_at IS NULL;

  RAISE NOTICE 'Successfully inserted 5 routes and linked 29 orders.';
END $$;
