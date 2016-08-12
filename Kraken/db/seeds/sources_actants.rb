STDERR.puts "Seeding Sources Actants"

sources_actants_word_counts = JSON.parse(open("db/seeds/sources_actants_word_counts.json").read)

sources_actants = []

["source", "recipient"].each do |type|
  EMDROS["#{type}actant_objects".to_sym].each do |source_actant_object|
    id = source_actant_object[:object_id_d]
    source_actant_word_count = sources_actants_word_counts.find{ |owc| owc["id"] == id }

    if source_object = EMDROS[:source_objects].where('first_monad <= ? AND last_monad >= ?', source_actant_object[:first_monad], source_actant_object[:last_monad]).first
      source_actant = {
        id: id,
        actant_id: source_actant_object[:mdf_actant_id],
        source_id: source_object[:object_id_d],
    		word_count: source_actant_word_count["wordCount"],
        family_count: source_actant_word_count["sphereCounts"].find{ |c| c["string"] == "family" }["count"],
        economics_count: source_actant_word_count["sphereCounts"].find{ |c| c["string"] == "economics" }["count"],
        government_count: source_actant_word_count["sphereCounts"].find{ |c| c["string"] == "government" }["count"],
        religion_count: source_actant_word_count["sphereCounts"].find{ |c| c["string"] == "religion" }["count"],
        education_count: source_actant_word_count["sphereCounts"].find{ |c| c["string"] == "economics" }["count"],
        communication_count: source_actant_word_count["sphereCounts"].find{ |c| c["string"] == "communication" }["count"],
        celebration_count: source_actant_word_count["sphereCounts"].find{ |c| c["string"] == "celebration" }["count"],
    	}

      DB["#{type}_actants".to_sym].insert(source_actant)

      sources_actants << {
        first: source_actant_object[:first_monad],
        last: source_actant_object[:last_monad],
        is_source: type == "source"
      }.merge(source_actant)
    else
      STDERR.puts "Can't find source object for source actant #{source_actant_object.inspect}"
    end
  end
end

File.open("db/seeds/sources_actants.json", "w+") {|f| f.write JSON.pretty_generate(sources_actants)}
