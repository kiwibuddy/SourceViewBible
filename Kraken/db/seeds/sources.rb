STDERR.puts "Seeding Sources"


EMDROS[:source_objects].each do |source_object|
  source = {
    id: source_object[:object_id_d],
    book_id: EMDROS[:book_objects]['first_monad <= ? AND last_monad >= ?', source_object[:first_monad], source_object[:last_monad]][:mdf_djhref],
    first: source_object[:first_monad],
    last: source_object[:last_monad],
    occurrence: source_object[:mdf_source_occurrence],
    role: source_object[:mdf_source_color]
  }

  DB[:sources].insert(source)
end
