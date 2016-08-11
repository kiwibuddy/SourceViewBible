STDERR.puts "Seeding Actant Roles"

statements = EMDROS['SELECT DISTINCT statement_objects.object_id_d, statement_objects.mdf_sources, source_objects.mdf_source_color
FROM statement_objects INNER JOIN source_objects ON source_objects.first_monad = statement_objects.first_monad
	AND source_objects.last_monad = statement_objects.last_monad']

statements.each do |statement|
	statement[:mdf_sources].to_s.strip.split(" ").map{|r| r.to_i}.each do |actant_id|
		if actant_id > 0 && actant = DB[:actant_statements][id:actant_id, statement_id: statement[:object_id_d]]
			role_id = statement[:mdf_source_color].to_s.to_i
			if role_id > 0
				DB[:actant_roles].insert(id: actant_id, role_id:role_id) rescue nil
			end
		end
	end
end
