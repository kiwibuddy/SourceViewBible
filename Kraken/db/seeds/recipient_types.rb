def seed_recipient_type_statements
  STDERR.puts "Seeding Recipient Type Statements"

  recipient_type_statements = []
  DB[:recipient_statements].each_with_index do |recipient_statement, index|
    statement_objects = EMDROS['SELECT DISTINCT source_objects.mdf_source_color
    FROM statement_objects INNER JOIN source_objects ON source_objects.first_monad = statement_objects.first_monad
      AND source_objects.last_monad = statement_objects.last_monad
      AND statement_objects.mdf_sources LIKE ?', "% #{recipient_statement[:id]} %"]

    statement_objects.each do |statement_object|
      id = statement_object[:mdf_source_color].to_s.to_i
      if id > 0
        recipient_type_statement = {id: id, statement_id: recipient_statement[:statement_id]}
        recipient_type_statements << recipient_type_statement unless recipient_type_statements.include?(recipient_type_statement)
      end
    end
  end

  recipient_type_statements.each do |recipient_type_statement|
    DB[:recipient_type_statements].insert(recipient_type_statement)
  end
end
