
STDERR.puts "Seeding Actant Genders"

EMDROS[:actant_objects].each do |actant|
  gender_id = actant[:mdf_gender].to_s.to_i
  if gender_id == 1 || gender_id == 2
    DB[:actant_genders].insert(id: actant[:mdf_actant_id], gender_id: gender_id)
  end
end
