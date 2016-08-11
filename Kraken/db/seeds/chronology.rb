
STDERR.puts "Seeding Actant Chronology"

EMDROS[:actant_objects].each do |actant|
  actant[:mdf_chronology].to_s.strip.split(" ").map{|p| p.to_i}.each do |chronology_id|
    if chronology_id > 0
      DB[:actant_chronologies].insert(id: actant[:mdf_actant_id], chronology_id: chronology_id) rescue nil
    end
  end
end
