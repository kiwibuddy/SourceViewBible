STDERR.puts "Seeding Natures"

EMDROS[:actant_objects].each do |actant_object|
	natures = actant_object[:mdf_natures].to_s.strip.split(' ').select{|c| c.to_i > 0}.map{|c| c.to_i }.uniq

  natures.each do |nature_id|
    nature = {
      actant_id: actant_object[:mdf_actant_id],
      nature_id: nature_id
    }
    DB[:natures].insert(nature)
  end
end
