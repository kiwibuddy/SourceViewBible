STDERR.puts "Seeding Professions"

PROFESSIONS = JSON.parse(open("db/seeds/professions.json").read)
EXCLUDE_PROFESSIONS = PROFESSIONS.select{ |p| p["searchable"] == false }.map{|p| p["id"]}

EMDROS[:actant_objects].each do |actant_object|
	professions = actant_object[:mdf_professions].to_s.strip.split(' ').select{|c| c.to_i > 0 && !EXCLUDE_PROFESSIONS.include?(c.to_i)}.map{|c| c.to_i }.uniq

  professions.each do |profession_id|
    profession = {
      actant_id: actant_object[:mdf_actant_id],
      profession_id: profession_id
    }
    DB[:professions].insert(profession) rescue nil
  end
end
