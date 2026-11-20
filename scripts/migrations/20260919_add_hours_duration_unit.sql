-- Allow hourly trips such as the Kom Ombo & Edfu day trip.
ALTER TABLE trips
MODIFY duration_unit ENUM('hours', 'days', 'weeks', 'months') NOT NULL DEFAULT 'days';
