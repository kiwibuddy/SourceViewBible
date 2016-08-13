STDERR.puts "Seeding Chronologies"

EMDROS[:actant_objects].each do |actant_object|
	chronology = actant_object[:mdf_chronology].to_s.strip.split(' ').select{|c| c.to_i > 0}.map{|c| c.to_i }.uniq

  chronology.each do |chronology_id|
    chronology = {
      actant_id: actant_object[:mdf_actant_id],
      chronology_id: chronology_id
    }
    DB[:chronologies].insert(chronology)
  end
end
