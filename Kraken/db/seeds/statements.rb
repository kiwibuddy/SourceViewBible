STDERR.puts "Seeding Statements"

statements = []
statement_objects = EMDROS['SELECT DISTINCT statement_objects.*, source_objects.mdf_source_occurrence
FROM statement_objects INNER JOIN source_objects ON source_objects.first_monad = statement_objects.first_monad
	AND source_objects.last_monad = statement_objects.last_monad']

statement_objects.each do |statement_object|
	statements << {
		id: statement_object[:object_id_d],
		firstMonad: statement_object[:first_monad],
		lastMonad: statement_object[:last_monad],
    recipients: statement_object[:mdf_recipients].to_s.strip.split(' ').map{|r| r.to_i},
		sourceID: statement_object[:mdf_sources].to_s.strip.to_i,
    sourceOccurrence: statement_object[:mdf_source_occurrence]
	}

  DB[:statements].insert(id: statement_object[:object_id_d], first: statement_object[:first_monad], last: statement_object[:last_monad])
end

# pp statements
File.open("db/seeds/statements.json", "w+") { |f| f.write JSON.pretty_generate(statements) }
