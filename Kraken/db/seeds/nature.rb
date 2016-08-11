
STDERR.puts "Seeding Actant Natures"

EMDROS[:actant_objects].each do |actant|
  actant[:mdf_natures].to_s.strip.split(" ").map{|p| p.to_i}.each do |nature_id|
    if nature_id > 0
      DB[:actant_natures].insert(id: actant[:mdf_actant_id], nature_id: nature_id)
    end
  end
end
