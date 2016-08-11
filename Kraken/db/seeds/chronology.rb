
['source', 'recipient'].each do |type|
  STDERR.puts "Seeding #{type} chronology statements"

  EMDROS[:statement_objects].each do |statement_object|
    statement_object["mdf_#{type}s".to_sym].to_s.strip.split(' ').map{|a| a.to_i}.each do |actant_id|
      if actant = EMDROS[:actant_objects].where(mdf_actant_id: actant_id).first
        chronologies = actant[:mdf_chronology].to_s.strip.split(" ").map{|p| p.to_i}
        if chronologies.length <= 2
          chronologies.each do |id|
            if id > 0
              chronology_statement = {id: id, statement_id: statement_object[:object_id_d]}
              DB["chronology_statements".to_sym].insert(chronology_statement) rescue nil
            end
          end
        end
      end
    end
  end
end
