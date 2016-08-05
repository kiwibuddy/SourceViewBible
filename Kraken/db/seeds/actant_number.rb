
def seed_actant_number_statements(type)
  STDERR.puts "Seeding #{type} actant_number statements"

  EMDROS[:statement_objects].each do |statement_object|
    statement_object["mdf_#{type}s".to_sym].to_s.strip.split(' ').map{|a| a.to_i}.each do |actant_id|
      if actant = EMDROS[:actant_objects].where(mdf_actant_id: actant_id).first
        actant_number_id = actant[:mdf_source_number].to_s.to_i
        if actant_number_id == 1 || actant_number_id == 2
          actant_number_statement = {actant_number_id: actant_number_id, statement_id: statement_object[:object_id_d]}
          DB["#{type}_actant_number_statements".to_sym].insert(actant_number_statement) rescue nil
        end
      end
    end
  end
end
