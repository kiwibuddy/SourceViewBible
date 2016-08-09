STDERR.puts "Seeding Recipient Type Statements"

source_identifiers = EMDROS[:statement_objects].map do |statement_object|
    recipient_identifiers = statement_object[:mdf_recipients].to_s.strip.split(' ').map { |recipient_id| recipient_id.to_i}
    DB[:source_statements].where(id: recipient_identifiers).get(:id)
end.flatten.uniq

source_identifiers.each do |source_id|
  statement_objects = EMDROS['SELECT DISTINCT statement_objects.*, source_objects.mdf_source_color
  FROM statement_objects INNER JOIN source_objects ON source_objects.first_monad = statement_objects.first_monad
  	AND source_objects.last_monad = statement_objects.last_monad
    AND statement_objects.mdf_sources LIKE ?', "% #{source_id} %"]

  statement_objects.each do |statement_object|
    id = statement_object[:mdf_source_color].to_s.to_i
    if id > 0
      DB[:recipient_type_statements].insert(id: id, statement_id: statement_object[:object_id_d])
    end
  end
end
