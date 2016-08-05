STDERR.puts "Seeding Actants"

actant_objects = EMDROS['SELECT DISTINCT actant_objects.*, actant_mdf_real_name_set.string_value AS real_name,
	CASE WHEN sourceactant_objects.object_id_d > 0 THEN 1 ELSE 0 END AS is_source,
	CASE WHEN recipientactant_objects.object_id_d > 0 THEN 1 ELSE 0 END AS is_recipient
FROM actant_objects INNER JOIN actant_mdf_real_name_set ON actant_mdf_real_name_set.id_d = actant_objects.mdf_real_name
	LEFT JOIN sourceactant_objects ON actant_objects.mdf_actant_id = sourceactant_objects.mdf_actant_id
	LEFT JOIN recipientactant_objects ON actant_objects.mdf_actant_id = recipientactant_objects.mdf_actant_id']

actants = actant_objects.all.map do |actant_object|
  name = actant_object[:real_name]
  first_initial = name[0]

  {
    id: actant_object[:mdf_actant_id],
    name: name,
    firstInitial: first_initial,
    natureValues: value_or_nil(actant_object[:mdf_natures]),
    gender: actant_object[:mdf_gender],
    actantNumber: actant_object[:mdf_source_number],
    chronologyValues: value_or_nil(actant_object[:mdf_chronology]),
    professionValues: value_or_nil(actant_object[:mdf_professions]),
    isSource: actant_object[:is_source] == 1,
    isRecipient: actant_object[:is_recipient] == 1,
  }

end

# pp actants
File.open("db/seeds/actants.json", "w+") { |f| f.write JSON.pretty_generate(actants) }

source_statements = EMDROS[:statement_objects].map { |s| {statement_id: s[:object_id_d], source_id: s[:mdf_sources].to_s.strip.to_i}}
source_statements.each do |source_statement|
	source_id = source_statement[:source_id]
	if source_id > 0
		DB[:source_statements].insert(source_statement)

		if source = EMDROS[:actant_objects].where(mdf_actant_id: source_id).first
			source[:mdf_professions].to_s.strip.split(" ").map{|p| p.to_i}.each do |profession_id|
				if profession_id > 0
					profession_statement = {profession_id: profession_id, statement_id: source_statement[:statement_id]}
					DB[:source_profession_statements].insert(profession_statement) rescue nil
				end
			end
		end
	end
end



recipient_statements = []
EMDROS[:statement_objects].each do |s|
	s[:mdf_recipients].to_s.strip.split(" ").map{|r| r.to_i}.each do |recipient_id|
		recipient_statements << {statement_id: s[:object_id_d], recipient_id: recipient_id} if recipient_id > 0
	end
end
recipient_statements.each do |recipient_statement|
	DB[:recipient_statements].insert(recipient_statement)

	if recipient = EMDROS[:actant_objects].where(mdf_actant_id: recipient_statement[:recipient_id]).first
		recipient[:mdf_professions].to_s.strip.split(" ").map{|p| p.to_i}.each do |profession_id|
			if profession_id > 0
				profession_statement = {profession_id: profession_id, statement_id: recipient_statement[:statement_id]}
				DB[:recipient_profession_statements].insert(profession_statement) rescue nil
			end
		end
	end
end
