STDERR.puts "Seeding Source Type Statements"

statements = []
statement_objects = EMDROS['SELECT DISTINCT statement_objects.*, source_objects.mdf_source_color
FROM statement_objects INNER JOIN source_objects ON source_objects.first_monad = statement_objects.first_monad
	AND source_objects.last_monad = statement_objects.last_monad']

statement_objects.each do |statement_object|
  id = statement_object[:mdf_source_color].to_s.to_i
  if id > 0
    DB[:source_type_statements].insert(id: id, statement_id: statement_object[:object_id_d])
  end
end
