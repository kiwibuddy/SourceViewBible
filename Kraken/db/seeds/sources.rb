STDERR.puts "Seeding Sources"

BOOKS = EMDROS[:book_objects].map{ |book| book[:mdf_djhref] }

EMDROS[:source_objects].each do |source_object|
  book = EMDROS[:book_objects]['first_monad <= ? AND last_monad >= ?', source_object[:first_monad], source_object[:last_monad]]
  source = {
    id: source_object[:object_id_d],
    book_id: BOOKS.index(book[:mdf_djhref]) + 1,
    first: source_object[:first_monad],
    last: source_object[:last_monad],
    occurrence: source_object[:mdf_source_occurrence],
    role_id: source_object[:mdf_source_color]
  }

  DB[:sources].insert(source)
end
