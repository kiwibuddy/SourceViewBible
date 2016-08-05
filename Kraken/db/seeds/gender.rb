
def seed_gender_statements(table, column)
  STDERR.puts "Seeding #{table}"

  EMDROS[:statement_objects].each do |statement_object|
    statement_object[column.to_sym].to_s.strip.split(' ').map{|a| a.to_i}.each do |actant_id|
      if actant = EMDROS[:actant_objects].where(mdf_actant_id: actant_id).first
        gender_id = actant[:mdf_gender].to_s.to_i
        if gender_id == 1 || gender_id == 2
          gender_statement = {gender_id: gender_id, statement_id: statement_object[:object_id_d]}
          DB[table.to_sym].insert(gender_statement) rescue nil
        end
      end
    end
  end
end
