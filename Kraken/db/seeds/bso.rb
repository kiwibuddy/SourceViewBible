STDERR.puts "Seeding BSO"

BOOKS = JSON.parse(open("app/books.json").read)
BSO_WORD_COUNTS = JSON.parse(open("db/seeds/bso_word_counts.json").read)

sql = 'SELECT DISTINCT source_objects.*, source_mdf_source_name_set.string_value AS name
FROM source_objects INNER JOIN source_mdf_source_name_set ON source_mdf_source_name_set.id_d = source_objects.mdf_source_name'

book_source_occurrences = EMDROS[sql].map do |source_object|
  id = source_object[:object_id_d]
  first = source_object[:first_monad]
  last = source_object[:last_monad]
  book_object = EMDROS[:book_objects]['first_monad <= ? AND last_monad >= ?', first, last]
  book = BOOKS.find{ |b| b["DJHRef"] == book_object[:mdf_djhref]}
  word_counts = BSO_WORD_COUNTS.find{ |c| c["id"] == id } || {}

  bso = {
    id: source_object[:object_id_d],
    first: source_object[:first_monad],
    last: source_object[:last_monad],
    book_id: BOOKS.index(book) + 1,
    source_id: source_object[:mdf_source_name],
    occurrence_id: source_object[:mdf_source_occurrence],
    role_id: source_object[:mdf_source_color],
    word_count: word_counts["wordCount"]
  }

  begin
    DB[:bso].insert(bso)
  rescue Exception => e
    pp source_object
    raise e
  end

  bso.merge({
    actant_id: source_object[:mdf_actant_id],
    name: source_object[:name]
  })
end

File.open("db/seeds/bso.json", "w+") {|f| f.write JSON.pretty_generate(book_source_occurrences)}
