STDERR.puts "Seeding Actants"

exclude_actants = [236, 257, 766]; # Word around Hebrews. Need to change these number if we get a new data dump
actants = []
EMDROS[:actant_objects].where('mdf_actant_id NOT IN ?', exclude_actants).each do |actant_object|
	actant = {
		id: actant_object[:mdf_actant_id],
		actant_number_id: actant_object[:mdf_source_number],
		gender_id: actant_object[:mdf_gender],
	}
	DB[:actants].insert(actant)
	chronologies = actant_object[:mdf_chronology].to_s.strip.split(' ').select{|c| c.to_i > 0 && c.to_i < 19 }.map{|c| {id: c.to_i} }
	natures = actant_object[:mdf_natures].to_s.strip.split(' ').select{|c| c.to_i > 0}.map{|c| {id: c.to_i} }
	professions = actant_object[:mdf_professions].to_s.strip.split(' ').select{|c| c.to_i > 0}.map{|c| {id: c.to_i} }

	isSource = EMDROS[:sourceactant_objects][mdf_actant_id: actant_object[:mdf_actant_id]] != nil
	isRecipient = EMDROS[:recipientactant_objects][mdf_actant_id: actant_object[:mdf_actant_id]] != nil
	next unless isSource || isRecipient

	name = if isSource
		EMDROS['SELECT string_value AS name FROM sourceactant_mdf_real_name_set INNER JOIN sourceactant_objects ON sourceactant_mdf_real_name_set.id_d = sourceactant_objects.mdf_real_name WHERE mdf_actant_id = ? AND sourceactant_objects.mdf_is_source_name = ? AND mdf_real_name != ? LIMIT 1', actant_object[:mdf_actant_id], 2, SOURCE_NARRATOR_ID].first[:name] rescue nil
	else
		EMDROS['SELECT string_value AS name FROM recipientactant_mdf_real_name_set INNER JOIN recipientactant_objects ON recipientactant_mdf_real_name_set.id_d = recipientactant_objects.mdf_real_name WHERE mdf_actant_id = ? LIMIT 1', actant_object[:mdf_actant_id]].first[:name] rescue nil
	end

	unless name
		name = EMDROS['SELECT string_value AS name FROM actant_mdf_real_name_set INNER JOIN actant_objects ON actant_mdf_real_name_set.id_d = actant_objects.mdf_real_name WHERE mdf_actant_id = ? LIMIT 1', actant_object[:mdf_actant_id]].first[:name]
	end

	unless name
		STDERR.puts actant_object.inspect.to_s
		exit
	end

	actants << actant.merge({
		name: name,
		firstInitial: name[0],
		actantNumber: actant_object[:mdf_source_number],
		chronologies: chronologies,
		gender: actant_object[:mdf_gender],
		natures: natures,
		professions: professions,
		isSource: isSource,
		isRecipient: isRecipient,
	})
end


File.open("db/seeds/actants.json", "w+") { |f| f.write JSON.pretty_generate(actants) }
