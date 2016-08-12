STDERR.puts "Seeding Actants"

actants = []
EMDROS[:actant_objects].each do |actant_object|
	chronologies = actant_object[:mdf_chronology].to_s.strip.split(' ').select{|c| c.to_i > 0}.map{|c| {id: c.to_i} }
	natures = actant_object[:mdf_natures].to_s.strip.split(' ').select{|c| c.to_i > 0}.map{|c| {id: c.to_i} }
	professions = actant_object[:mdf_professions].to_s.strip.split(' ').select{|c| c.to_i > 0}.map{|c| {id: c.to_i} }

	actant = {
		id: actant_object[:mdf_actant_id],
		actant_number: actant_object[:mdf_source_number],
		chronologies: chronologies.length > 0 ? actant_object[:mdf_chronology] : nil,
		gender: actant_object[:mdf_gender],
		natures: natures.length > 0 ? actant_object[:mdf_natures] : nil,
		professions: professions.length > 0 ? actant_object[:mdf_professions] : nil,
	}

	name = EMDROS[:actant_mdf_real_name_set][id_d: actant_object[:mdf_real_name]][:string_value]
	first_initial = name[0]

	isSource = EMDROS[:sourceactant_objects][mdf_actant_id: actant_object[:mdf_actant_id]] != nil
	isRecipient = EMDROS[:recipientactant_objects][mdf_actant_id: actant_object[:mdf_actant_id]] != nil

	actants << actant.merge({
		name: name,
		first_initial: first_initial,
		chronologies: chronologies,
		natures: natures,
		professions: professions,
		isSource: isSource,
		isRecipient: isRecipient,
	})

	DB[:actants].insert(actant)
end


File.open("db/seeds/actants.json", "w+") { |f| f.write JSON.pretty_generate(actants) }
