STDERR.puts "Seeding Spheres"

# BSO_WORD_COUNTS = JSON.parse(open("db/seeds/bso_word_counts.json").read)

book_source_occurrences = EMDROS[:source_objects].each do |source_object|
  id = source_object[:object_id_d]
  word_counts = BSO_WORD_COUNTS.find{ |c| c["id"] == id } || {}

  ["family", "economics", "government", "religion", "education", "communication", "celebration"].each_with_index do |sphere_name, index|
    count = word_counts["sphereCounts"].find{ |c| c["string"] == sphere_name }["count"]
    if count > 0
      sphere = {
        bso_id: id,
        sphere_id: index + 1,
        word_count: count,
    	}
      DB[:spheres].insert(sphere)
    end
  end
end
