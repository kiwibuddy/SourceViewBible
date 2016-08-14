STDERR.puts "Seeding BSO"

BOOKS = EMDROS[:book_objects].map{ |book| book[:mdf_djhref] }
BSO_WORD_COUNTS = JSON.parse(open("db/seeds/bso_word_counts.json").read)

book_source_occurrences = EMDROS[:source_objects].map do |source_object|
  id = source_object[:object_id_d]
  first = source_object[:first_monad]
  last = source_object[:last_monad]
  book = EMDROS[:book_objects]['first_monad <= ? AND last_monad >= ?', first, last]
  word_counts = BSO_WORD_COUNTS.find{ |c| c["id"] == id }

  bso = {
    id: source_object[:object_id_d],
    first: source_object[:first_monad],
    last: source_object[:last_monad],
    book_id: BOOKS.index(book[:mdf_djhref]) + 1,
    source_id: source_object[:mdf_source_name],
    occurrence_id: source_object[:mdf_source_occurrence],
    role_id: source_object[:mdf_source_color],
    word_count: word_counts["wordCount"]
  }

  DB[:bso].insert(bso)
  bso
end

File.open("db/seeds/bso.json", "w+") {|f| f.write JSON.pretty_generate(book_source_occurrences)}
