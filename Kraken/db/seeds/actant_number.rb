
STDERR.puts "Seeding Actant Numbers"

EMDROS[:actant_objects].each do |actant|
  actant_number_id = actant[:mdf_source_number].to_s.to_i
  if actant_number_id == 1 || actant_number_id == 2
    DB[:actant_numbers].insert(id: actant[:mdf_actant_id], actant_number_id: actant_number_id)
  end
end
