package events

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
)

type TestEvent struct {
	Name    string
	Payload interface{}
}

func (e *TestEvent) GetName() string {
	return e.Name
}

func (e *TestEvent) SetPayload(payload interface{}) {

}

func (e *TestEvent) GetPayload() interface{} {
	return e.Payload
}

func (e *TestEvent) GetDateTime() time.Time {
	return time.Now()
}

type TestEventHandler struct {
	ID int
}

func (h *TestEventHandler) Handle(event EventInterface) {}

type EventDispatcherTestSuite struct {
	suite.Suite
	event1          TestEvent
	event2          TestEvent
	handler1        TestEventHandler
	handler2        TestEventHandler
	handler3        TestEventHandler
	eventDispatcher *EventDispatcher
}

func (suite *EventDispatcherTestSuite) SetupTest() {
	suite.eventDispatcher = NewEventDispatcher()
	suite.handler1 = TestEventHandler{
		ID: 1,
	}
	suite.handler2 = TestEventHandler{
		ID: 2,
	}
	suite.handler3 = TestEventHandler{
		ID: 3,
	}
	suite.event1 = TestEvent{
		Name:    "test1",
		Payload: "test1",
	}
	suite.event2 = TestEvent{
		Name:    "test2",
		Payload: "test2",
	}
}

func (suite *EventDispatcherTestSuite) TestEventDispatcher_Register() {
	err := suite.eventDispatcher.Register(suite.event1.GetName(), &suite.handler1)
	suite.Nil(err)
	suite.Equal(1, len(suite.eventDispatcher.handlers[suite.event1.GetName()]))

	err = suite.eventDispatcher.Register(suite.event1.GetName(), &suite.handler2)
	suite.Nil(err)
	suite.Equal(2, len(suite.eventDispatcher.handlers[suite.event1.GetName()]))

	assert.Equal(suite.T(), &suite.handler1, suite.eventDispatcher.handlers[suite.event1.GetName()][0])
	assert.Equal(suite.T(), &suite.handler2, suite.eventDispatcher.handlers[suite.event1.GetName()][1])
}

func (suite *EventDispatcherTestSuite) TestEventDispatcher_Register_WithSameHandler() {
	err := suite.eventDispatcher.Register(suite.event1.GetName(), &suite.handler1)
	suite.Nil(err)
	suite.Equal(1, len(suite.eventDispatcher.handlers[suite.event1.GetName()]))

	err = suite.eventDispatcher.Register(suite.event1.GetName(), &suite.handler1)
	suite.Equal(ErrorHandlerAlreadyRegistered, err)
	suite.Equal(1, len(suite.eventDispatcher.handlers[suite.event1.GetName()]))
}

func (suite *EventDispatcherTestSuite) TestEventDispatcher_Clear() {
	// Event 1
	err := suite.eventDispatcher.Register(suite.event1.GetName(), &suite.handler1)
	suite.Nil(err)
	suite.Equal(1, len(suite.eventDispatcher.handlers[suite.event1.GetName()]))

	err = suite.eventDispatcher.Register(suite.event1.GetName(), &suite.handler2)
	suite.Nil(err)
	suite.Equal(2, len(suite.eventDispatcher.handlers[suite.event1.GetName()]))

	// Event 2
	err = suite.eventDispatcher.Register(suite.event2.GetName(), &suite.handler3)
	suite.Nil(err)
	suite.Equal(1, len(suite.eventDispatcher.handlers[suite.event2.GetName()]))

	suite.eventDispatcher.Clear()
	suite.Equal(0, len(suite.eventDispatcher.handlers))
}

func (suite *EventDispatcherTestSuite) TestEventInterfaceDispatcher_Has() {
	err := suite.eventDispatcher.Register(suite.event1.GetName(), &suite.handler1)
	suite.Nil(err)
	suite.Equal(1, len(suite.eventDispatcher.handlers[suite.event1.GetName()]))

	err = suite.eventDispatcher.Register(suite.event1.GetName(), &suite.handler2)
	suite.Nil(err)
	suite.Equal(2, len(suite.eventDispatcher.handlers[suite.event1.GetName()]))

	assert.True(suite.T(), suite.eventDispatcher.Has(suite.event1.GetName(), &suite.handler1))
	assert.True(suite.T(), suite.eventDispatcher.Has(suite.event1.GetName(), &suite.handler2))
	assert.False(suite.T(), suite.eventDispatcher.Has(suite.event1.GetName(), &suite.handler3))
}

func (suite *EventDispatcherTestSuite) TestEventDispatcher_Remove() {
	// Event 1
	err := suite.eventDispatcher.Register(suite.event1.GetName(), &suite.handler1)
	suite.Nil(err)
	suite.Equal(1, len(suite.eventDispatcher.handlers[suite.event1.GetName()]))

	err = suite.eventDispatcher.Register(suite.event1.GetName(), &suite.handler2)
	suite.Nil(err)
	suite.Equal(2, len(suite.eventDispatcher.handlers[suite.event1.GetName()]))

	// Event 2
	err = suite.eventDispatcher.Register(suite.event2.GetName(), &suite.handler3)
	suite.Nil(err)
	suite.Equal(1, len(suite.eventDispatcher.handlers[suite.event2.GetName()]))

	suite.eventDispatcher.Remove(suite.event1.GetName(), &suite.handler1)
	suite.Equal(1, len(suite.eventDispatcher.handlers[suite.event1.GetName()]))
	assert.Equal(suite.T(), &suite.handler2, suite.eventDispatcher.handlers[suite.event1.GetName()][0])

	suite.eventDispatcher.Remove(suite.event1.GetName(), &suite.handler2)
	suite.Equal(0, len(suite.eventDispatcher.handlers[suite.event1.GetName()]))

	suite.eventDispatcher.Remove(suite.event2.GetName(), &suite.handler3)
	suite.Equal(0, len(suite.eventDispatcher.handlers[suite.event2.GetName()]))
}

type MockHandler struct {
	mock.Mock
}

func (m *MockHandler) Handle(event EventInterface) {
	m.Called(event)
}

func (suite *EventDispatcherTestSuite) TestEventInterfaceDispatcher_Dispatch() {
	eh := &MockHandler{}
	eh.On("Handle", &suite.event1)

	err := suite.eventDispatcher.Register(suite.event1.GetName(), eh)
	suite.Nil(err)

	err = suite.eventDispatcher.Dispatch(&suite.event1)
	suite.Nil(err)

	eh.AssertExpectations(suite.T())
	eh.AssertNumberOfCalls(suite.T(), "Handle", 1)
}

func TestSuite(t *testing.T) {
	suite.Run(t, new(EventDispatcherTestSuite))
}
