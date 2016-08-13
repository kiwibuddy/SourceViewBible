STDERR.puts "Seeding Professions"

EMDROS[:actant_objects].each do |actant_object|
	professions = actant_object[:mdf_professions].to_s.strip.split(' ').select{|c| c.to_i > 0}.map{|c| c.to_i }.uniq

  professions.each do |profession_id|
    profession = {
      actant_id: actant_object[:mdf_actant_id],
      profession_id: profession_id
    }
    DB[:professions].insert(profession)
  end
end
