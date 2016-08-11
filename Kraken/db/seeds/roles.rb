STDERR.puts "Seeding Source Role Statements"

statement_objects = EMDROS['SELECT DISTINCT statement_objects.object_id_d, source_objects.mdf_source_color
FROM statement_objects INNER JOIN source_objects ON source_objects.first_monad = statement_objects.first_monad
	AND source_objects.last_monad = statement_objects.last_monad']

statement_objects.each do |statement_object|
  id = statement_object[:mdf_source_color].to_s.to_i
  if id > 0
    DB[:source_role_statements].insert(id: id, statement_id: statement_object[:object_id_d])
  end
end

STDERR.puts "Seeding Recipient Type Statements"

recipient_role_statements = []
DB[:recipient_statements].each_with_index do |recipient_statement, index|
	statement_objects = EMDROS['SELECT DISTINCT source_objects.mdf_source_color
	FROM statement_objects INNER JOIN source_objects ON source_objects.first_monad = statement_objects.first_monad
		AND source_objects.last_monad = statement_objects.last_monad
		AND statement_objects.mdf_sources LIKE ?', "% #{recipient_statement[:id]} %"]

	statement_objects.each do |statement_object|
		id = statement_object[:mdf_source_color].to_s.to_i
		if id > 0
			recipient_role_statement = {id: id, statement_id: recipient_statement[:statement_id]}
			recipient_role_statements << recipient_role_statement unless recipient_role_statements.include?(recipient_role_statement)
		end
	end
end

recipient_role_statements.each do |recipient_role_statement|
	DB[:recipient_role_statements].insert(recipient_role_statement)
end

insert_sql = "INSERT INTO role_statements
SELECT id, statement_id FROM (
SELECT id, statement_id FROM source_role_statements
UNION
SELECT id, statement_id FROM recipient_role_statements
)
"
DB.run insert_sql
