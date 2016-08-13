STDERR.puts "Seeding Spheres"

sources_actants_word_counts = JSON.parse(open("db/seeds/sources_actants_word_counts.json").read)

sources_actants = []

EMDROS["sourceactant_objects".to_sym].each do |source_actant_object|
  id = source_actant_object[:object_id_d]
  source_actant_word_count = sources_actants_word_counts.find{ |owc| owc["id"] == id }

  ["family", "economics", "government", "religion", "education", "communication", "celebration"].each_with_index do |sphere_name, index|
    count = source_actant_word_count["sphereCounts"].find{ |c| c["string"] == sphere_name }["count"]
    if count > 0
      sphere = {
        source_actant_id: id,
        sphere_id: index + 1,
        count: count,
    	}
      DB[:spheres].insert(sphere)
    end
  end
end
