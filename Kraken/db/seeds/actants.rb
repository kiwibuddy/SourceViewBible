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

	chronologies = actant_object[:mdf_chronology].to_s.strip.split(' ').map{|c| {id: c.to_i} }
	professions = actant_object[:mdf_professions].to_s.strip.split(' ').map{|c| {id: c.to_i} }
	natures = actant_object[:mdf_natures].to_s.strip.split(' ').map{|c| {id: c.to_i} }
  {
    id: actant_object[:mdf_actant_id],
    name: name,
    firstInitial: first_initial,
    natures: natures,
    gender: actant_object[:mdf_gender],
    actantNumber: actant_object[:mdf_source_number],
    chronologies: chronologies,
    professions: professions,
    isSource: actant_object[:is_source] == 1,
    isRecipient: actant_object[:is_recipient] == 1,
  }
end

EMDROS[:statement_objects].each do |s|
	s[:mdf_sources].to_s.strip.split(" ").map{|r| r.to_i}.each do |id|
		DB[:source_statements].insert({id: id, statement_id: s[:object_id_d]}) if id > 0
	end

	s[:mdf_recipients].to_s.strip.split(" ").map{|r| r.to_i}.each do |id|
		DB[:recipient_statements].insert({id: id, statement_id: s[:object_id_d]}) if id > 0
	end
end


insert_sql = "INSERT INTO actant_statements
SELECT id, statement_id FROM (
SELECT id, statement_id FROM source_statements
UNION
SELECT id, statement_id FROM recipient_statements
)
"
DB.run insert_sql

# pp actants
File.open("db/seeds/actants.json", "w+") { |f| f.write JSON.pretty_generate(actants) }
