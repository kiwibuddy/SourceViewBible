STDERR.puts "Seeding BSO Actants"

["source", "recipient"].each do |type|
  EMDROS["#{type}actant_objects".to_sym].each do |bso_actant_object|
    id = bso_actant_object[:object_id_d]

    if source_object = EMDROS[:source_objects].where('first_monad = ? AND last_monad = ?', bso_actant_object[:first_monad], bso_actant_object[:last_monad]).first
      bso_actant = {
        id: id,
        actant_id: bso_actant_object[:mdf_actant_id],
        type_id: type == "source" ? 1 : 2,
        bso_id: source_object[:object_id_d],
    	}

      # FIXME: Look into Unique Contstraint Violation
      DB[:bso_actants].insert(bso_actant) rescue nil
    else
      STDERR.puts "Can't find source object for source actant #{bso_actant_object.inspect}"
    end
  end
end
