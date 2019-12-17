
def test_events_available():
    import machinable
    machinable.events.on('test')
    machinable.events.once('test')
