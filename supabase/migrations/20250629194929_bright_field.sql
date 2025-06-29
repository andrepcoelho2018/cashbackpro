/*
  # Create default customer levels

  1. New Tables
    - Inserts default customer levels (Bronze, Silver, Gold) if none exist
  2. Security
    - Uses existing RLS policies
*/

-- Insert default customer levels if the table is empty
INSERT INTO customer_levels (name, color, icon, order_position, min_points, min_purchase_value, timeframe_days, points_multiplier, referral_bonus, free_shipping, exclusive_events, custom_rewards)
SELECT 'Bronze', '#CD7F32', 'award', 1, 0, 0, 0, 1.0, 1.0, false, false, '[]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM customer_levels);

INSERT INTO customer_levels (name, color, icon, order_position, min_points, min_purchase_value, timeframe_days, points_multiplier, referral_bonus, free_shipping, exclusive_events, custom_rewards)
SELECT 'Prata', '#C0C0C0', 'star', 2, 1000, 500, 365, 1.2, 1.5, true, false, '[]'::jsonb
WHERE (SELECT COUNT(*) FROM customer_levels) = 1;

INSERT INTO customer_levels (name, color, icon, order_position, min_points, min_purchase_value, timeframe_days, points_multiplier, referral_bonus, free_shipping, exclusive_events, custom_rewards)
SELECT 'Ouro', '#FFD700', 'crown', 3, 5000, 2000, 365, 1.5, 2.0, true, true, '[]'::jsonb
WHERE (SELECT COUNT(*) FROM customer_levels) = 2;