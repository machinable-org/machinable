
class QueryBuilder:

    @property
    def object(self):
        """Returns the query object"""
        return self._query

    def _field_mapping(self, field):
        return field

    def where(self, field, operator='=', value=None, boolean='and'):
        """"""
        field = self._field_mapping(field)
        self._query = self._query.where(field, operator, value, boolean)

        return self

    def or_where(self, field, operator='=', value=None):
        """"""
        return self.where(field, operator, value, 'or')

    def where_between(self, field, values, boolean='and', negate=False):
        """"""
        field = self._field_mapping(field)
        self._query = self._query.where_between(field, values, boolean, negate)

        return self

    def or_where_between(self, field, values):
        """"""
        return self.where_between(field, values, 'or')

    def where_not_between(self, field, values, boolean='and'):
        """"""
        return self.where_between(field, values, boolean, True)

    def or_where_not_between(self, field, values):
        """"""
        return self.where_not_between(field, values, 'or')

    def where_in(self, field, values, boolean='and', negate=False):
        """"""
        field = self._field_mapping(field)
        self._query = self._query.where_in(field, values, boolean, negate)

    def or_where_in(self, field, values):
        """"""
        return self.where_in(field, values, 'or')

    def where_not_in(self, field, values, boolean='and'):
        """"""
        return self.where_in(field, values, boolean, True)

    def or_where_not_in(self, field, values):
        """"""
        return self.where_not_in(field, values, 'or')

    def where_has(self, relation, extra, operator='>=', count=1):
        """"""
        self._query = self._query.where_has(relation, extra, operator, count)

        return self

    def order_by(self, field, direction='asc'):
        """"""
        field = self._field_mapping(field)
        self._query = self._query.order_by(field, direction)
        return self

    def skip(self, value):
        """"""
        self._query = self._query.skip(value)
        return self

    def take(self, value):
        """"""
        self._query = self._query.take(value)
        return self

    def union(self, query, all=False):
        """"""
        self._query.union(query, all)
        return self

    def union_all(self, query):
        """"""
        return self.union(query, True)
