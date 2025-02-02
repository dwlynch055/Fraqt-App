/*
  # Analytics Functions

  Creates functions for calculating analytics data:
  - Total passes
  - Active passes
  - Scans last week
  - Customer engagement
*/

CREATE OR REPLACE FUNCTION get_merchant_analytics(merchant_id_param uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_passes integer;
  active_passes integer;
  scans_last_week integer;
  customer_engagement numeric;
BEGIN
  -- Get total passes
  SELECT COUNT(*) INTO total_passes
  FROM passes
  WHERE merchant_id = merchant_id_param;

  -- Get active passes
  SELECT COUNT(*) INTO active_passes
  FROM passes
  WHERE merchant_id = merchant_id_param
  AND status = 'active';

  -- Calculate customer engagement (active/total ratio)
  IF total_passes > 0 THEN
    customer_engagement := (active_passes::numeric / total_passes::numeric) * 100;
  ELSE
    customer_engagement := 0;
  END IF;

  RETURN json_build_object(
    'totalPasses', total_passes,
    'activePasses', active_passes,
    'scansLastWeek', 0, -- Placeholder for actual scan tracking
    'customerEngagement', customer_engagement
  );
END;
$$;