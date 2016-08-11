
STDERR.puts "Seeding Actant Professions"

EMDROS[:actant_objects].each do |actant|
  actant[:mdf_professions].to_s.strip.split(" ").map{|p| p.to_i}.each do |profession_id|
    if profession_id > 0
      DB[:actant_professions].insert(id: actant[:mdf_actant_id], profession_id: profession_id) rescue nil
    end
  end
end
